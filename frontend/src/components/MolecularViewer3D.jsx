import React, { useEffect, useRef, useState } from "react";

export default function MolecularViewer3D({
  pdbqtData,
  ligandName,
  height = "400px",
}) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pdbqtData || !containerRef.current) {
      setError("No PDBQT data provided");
      setLoading(false);
      return;
    }

    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const initViewer = async () => {
      try {
        // Load jQuery first (3Dmol requires it)
        if (!window.jQuery) {
          await loadScript("https://code.jquery.com/jquery-3.6.0.min.js");
        }

        // Load 3Dmol
        if (!window.$3Dmol) {
          await loadScript("https://3Dmol.csb.pitt.edu/build/3Dmol-min.js");
        }

        // Wait a bit for 3Dmol to initialize
        await new Promise((resolve) => setTimeout(resolve, 100));

        if (!window.$3Dmol) {
          throw new Error("3Dmol failed to load");
        }

        // Clear container
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }

        // Create viewer with explicit config
        const config = {
          backgroundColor: "white",
          antialias: true,
        };

        const viewer = window.$3Dmol.createViewer(
          window.$(containerRef.current),
          config
        );

        if (!viewer) {
          throw new Error("Failed to create viewer");
        }

        // Add model - try to parse PDBQT
        const model = viewer.addModel(pdbqtData, "pdbqt");

        if (!model) {
          throw new Error("Failed to add model");
        }

        // Set style - use ball and stick
        viewer.setStyle(
          {},
          {
            stick: {
              colorscheme: "Jmol",
              radius: 0.2,
            },
            sphere: {
              scale: 0.3,
              colorscheme: "Jmol",
            },
          }
        );

        // Zoom to fit
        viewer.zoomTo();

        // Render
        viewer.render();

        // Enable rotation
        viewer.rotate(90, "y");
        viewer.spin(true);

        viewerRef.current = viewer;
        setLoading(false);
        setError(null);

        console.log("3D viewer initialized successfully");
      } catch (err) {
        console.error("3Dmol initialization error:", err);
        setError(`Failed to load 3D viewer: ${err.message}`);
        setLoading(false);
      }
    };

    initViewer();

    return () => {
      if (viewerRef.current) {
        try {
          viewerRef.current.clear();
        } catch (e) {
          console.error("Error clearing viewer:", e);
        }
      }
    };
  }, [pdbqtData]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height,
          position: "relative",
          minHeight: height,
        }}
        className="border border-gray-200 rounded-lg bg-white"
      />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading 3D viewer...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 bg-opacity-90 rounded-lg">
          <div className="text-center text-red-600 p-4">
            <p className="text-sm font-medium mb-2">⚠️ Viewer Error</p>
            <p className="text-xs">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && ligandName && (
        <div className="absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium shadow-lg">
          {ligandName}
        </div>
      )}

      {!loading && !error && (
        <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 px-3 py-1 rounded text-xs text-gray-600 shadow">
          🖱️ Drag to rotate • 🔍 Scroll to zoom
        </div>
      )}
    </div>
  );
}
