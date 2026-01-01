import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        style: {
          background: "rgba(23, 23, 23, 0.95)",
          color: "#fff",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "0.75rem",
          padding: "16px",
          fontSize: "14px",
          fontWeight: "500",
          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.3)",
        },
        success: {
          iconTheme: {
            primary: "#22c55e",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
        },
        loading: {
          iconTheme: {
            primary: "#3b82f6",
            secondary: "#fff",
          },
        },
      }}
    />
  );
}
