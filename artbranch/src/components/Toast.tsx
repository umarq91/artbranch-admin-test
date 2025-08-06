import React, { createContext, useContext, ReactNode } from "react";
import { ToastContainer, toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ToastContextProps {
  showToast: (
    message: string,
    type: "success" | "info" | "error",
    options?: ToastOptions,
  ) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const showToast = (
    message: string,
    type: "success" | "info" | "error",
    options?: ToastOptions,
  ) => {
    const customOptions: ToastOptions = {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      progressClassName: "",
      ...options,
    };

    if (type === "success") {
      customOptions.progressClassName = "bg-green-600";
    } else if (type === "info") {
      customOptions.progressClassName = "bg-blue-700";
    } else if (type === "error") {
      customOptions.progressClassName = "bg-red-600";
    }

    toast[type](message, customOptions);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};
