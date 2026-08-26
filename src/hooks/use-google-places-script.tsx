import { useEffect, useState } from "react";

export type UseGooglePlacesScriptOptions = {
  apiKey?: string;
  id?: string;
};

export function useGooglePlacesScript({
  apiKey,
  id = "google-maps-places",
}: UseGooglePlacesScriptOptions = {}) {
  const resolvedApiKey =
    apiKey ?? import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "";

  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!resolvedApiKey) {
      setIsLoaded(false);
      setError("Google Maps API key is missing");
      return;
    }

    // Already loaded
    if (window.google?.maps) {
      setIsLoaded(true);
      setError(null);
      return;
    }

    // Check if script already exists
    const existingScript = document.getElementById(id);

    if (existingScript) {
      existingScript.addEventListener("load", handleLoad);
      existingScript.addEventListener("error", handleError);

      return () => {
        existingScript.removeEventListener("load", handleLoad);
        existingScript.removeEventListener("error", handleError);
      };
    }

    const script = document.createElement("script");

    script.id = id;
    script.src =
      `https://maps.googleapis.com/maps/api/js` +
      `?key=${encodeURIComponent(resolvedApiKey)}` +
      `&libraries=places` +
      `&loading=async`;

    script.async = true;
    script.defer = true;

    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);

    document.head.appendChild(script);

    return () => {
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
    };

    function handleLoad() {
      setIsLoaded(true);
      setError(null);
    }

    function handleError() {
      setIsLoaded(false);
      setError("Google Maps failed to load");
    }
  }, [resolvedApiKey, id]);

  return {
    apiKey: resolvedApiKey,
    isLoaded,
    error,
    hasApiKey: Boolean(resolvedApiKey),
  };
}