import React, { Suspense, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import "./styles/design-tokens.css";
import ToastProvider from "./components/ToastProvider";
import LoadingSpinner from "./components/LoadingSpinner";
import { preloadCriticalAssets } from "./utils/lazyLoading.jsx";

// Lazy load page components for code splitting
const Landing = React.lazy(() => import("./pages/Landing"));
const Analyze = React.lazy(() => import("./pages/Analyze"));
const History = React.lazy(() => import("./pages/History"));
const Compare = React.lazy(() => import("./pages/Compare"));

// Page loading fallback component
function PageLoadingFallback() {
  return (
    <div className="min-h-screen molecular-grid flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading page..." />
    </div>
  );
}

// App component with preloading
function App() {
  useEffect(() => {
    // Preload critical assets on app initialization
    preloadCriticalAssets();
  }, []);

  return (
    <BrowserRouter>
      <ToastProvider />
      <Suspense fallback={<PageLoadingFallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/history" element={<History />} />
          <Route path="/compare" element={<Compare />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
