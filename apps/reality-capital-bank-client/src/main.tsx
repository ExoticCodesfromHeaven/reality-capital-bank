import React from "react";
import ReactDOM from "react-dom/client";

import { QueryClientProvider } from "@tanstack/react-query";

import { BrowserRouter } from "react-router-dom";

import App from "./App";

import { Toaster } from "sonner";

import "./styles/globals.css";

import { queryClient } from "@/lib/queryClient";
import AuthProvider from "@/providers/AuthProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <App />

          <Toaster position="top-right" richColors />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
