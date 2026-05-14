"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          border: "1px solid #e4e4e7",
          boxShadow: "0 10px 30px rgba(24, 24, 27, 0.12)",
        },
      }}
    />
  );
}
