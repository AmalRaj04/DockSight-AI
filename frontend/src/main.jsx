import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import "./styles/design-tokens.css";
import Landing from "./pages/Landing";
import Analyze from "./pages/Analyze";
import History from "./pages/History";
import Compare from "./pages/Compare";
import ToastProvider from "./components/ToastProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/history" element={<History />} />
        <Route path="/compare" element={<Compare />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
