import { api } from "@/app/api-manage/api";
import { API_ROUTES } from "@/app/api-manage/api-routes";
import { useEffect, useState } from "react";

type DeviceState = Record<string, unknown>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getDeviceState = (payload: unknown): DeviceState | null => {
  if (!isRecord(payload)) return null;

  const wrappedState = payload.state ?? payload.data;
  return isRecord(wrappedState) ? wrappedState : payload;
};

export function useDeviceStreamState(cabinetId?: string) {
  const [deviceState, setDeviceState] = useState<DeviceState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cabinetId) {
      setDeviceState(null);
      setIsConnected(false);
      setError(null);
      return;
    }

    // Keep the SSE URL aligned with Axios: /api in development uses Vite's proxy,
    // while production uses VITE_API_URL directly.
    const baseUrl = (api.defaults.baseURL ?? "").replace(/\/$/, "");
    const streamUrl = `${baseUrl}${API_ROUTES.CABINETS}/${encodeURIComponent(cabinetId)}/device-state/stream`;
    let eventSource: EventSource | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
    let reconnectAttempt = 0;
    let disposed = false;

    const log = (message: string, details?: Record<string, unknown>) => {
      if (import.meta.env.DEV) {
        console.debug(`[device-state stream] ${message}`, details);
      }
    };

    const handleEvent = (event: MessageEvent<string>) => {
      try {
        const parsed = JSON.parse(event.data) as unknown;
        const nextDeviceState = getDeviceState(parsed);

        if (!nextDeviceState) {
          throw new Error("SSE payload does not contain a device state object");
        }

        setDeviceState(nextDeviceState);
        setError(null);
        log("Device state received", { cabinetId, eventType: event.type });
      } catch (parseError) {
        console.error("[device-state stream] Failed to parse device state event", {
          cabinetId,
          eventType: event.type,
          parseError,
        });
        setError("Received an invalid device-state update.");
      }
    };

    const connect = () => {
      if (disposed) return;

      reconnectTimer = undefined;
      eventSource?.close();
      log("Connecting", { cabinetId, streamUrl });

      // Authentication in this app is cookie-based. EventSource cannot send a
      // bearer header, but it will include the session cookie with credentials.
      const source = new EventSource(streamUrl, { withCredentials: true });
      eventSource = source;

      source.onopen = () => {
        reconnectAttempt = 0;
        setIsConnected(true);
        setError(null);
        log("Connected", { cabinetId });
      };

      source.onmessage = handleEvent;
      source.addEventListener("state", handleEvent as EventListener);

      source.onerror = () => {
        if (disposed || source !== eventSource) return;

        setIsConnected(false);

        if (source.readyState === EventSource.CLOSED) {
          if (reconnectTimer) return;

          const delay = Math.min(1_000 * 2 ** reconnectAttempt, 30_000);
          reconnectAttempt += 1;
          setError("Connection closed. Retrying...");
          log("Connection closed; scheduling reconnect", { cabinetId, delay });
          reconnectTimer = setTimeout(connect, delay);
          return;
        }

        // EventSource automatically reconnects while in CONNECTING state.
        setError("Connection interrupted. Reconnecting...");
        log("Connection interrupted; browser is reconnecting", { cabinetId });
      };
    };

    connect();

    return () => {
      disposed = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      eventSource?.close();
    };
  }, [cabinetId]);

  return { deviceState, isConnected, error };
}
