import toast, { type ToastOptions } from "react-hot-toast";

const baseOptions = (): ToastOptions => {
  return {
    style: {
      background: "#FAFAFA",
      color: "#333333",
      border: `1px solid #e0e0e0`,
      boxShadow: "none",
      fontSize: "14px"
    },
  };
};

export const successToast = (message: string): string => {
  return toast.success(message, { ...baseOptions(), id: "1" });
};

export const errorToast = (message: string): string => {
  return toast.error(message, { ...baseOptions(), id: "1" });
};

export const infoToast = (message: string): string => {
  return toast(message, { ...baseOptions(), id: "1" });
};

// Generic show function if callers want custom duration etc.
export const showToast = (message: string, opts?: ToastOptions): string => {
  return toast(message, { ...baseOptions(), ...opts });
};

export const loadingToast = (message: string): string => {
  return toast.loading(message, baseOptions());
};

export const dismissToast = (toastId?: string): void => {
  toast.dismiss(toastId);
};
