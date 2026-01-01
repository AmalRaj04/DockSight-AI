import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FiRotateCw,
  FiZoomIn,
  FiZoomOut,
  FiMaximize2,
  FiMinimize2,
  FiRefreshCw,
  FiCamera,
  FiEye,
  FiMove,
} from "react-icons/fi";

export default function MolecularViewer3D({
  pdbqtData,
  ligandName,
  height = "400px",
}) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentView, setCurrentView] = useState("default");

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

        // Create viewer with enhanced config
        const config = {
          backgroundColor: "white",
          antialias: true,
          alpha: true,
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

        // Set enhanced style - use ball and stick with better colors
        viewer.setStyle(
          {},
          {
            stick: {
              colorscheme: "Jmol",
              radius: 0.25,
            },
            sphere: {
              scale: 0.35,
              colorscheme: "Jmol",
            },
          }
        );

        // Improve lighting and rendering
        viewer.setBackgroundColor("white");

        // Zoom to fit
        viewer.zoomTo();

        // Render with better quality
        viewer.render();

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

  const handleRotate = () => {
    if (viewerRef.current) {
      viewerRef.current.rotate(90, "y");
      viewerRef.current.render();
    }
  };

  const handleZoomIn = () => {
    if (viewerRef.current) {
      viewerRef.current.zoom(1.2);
      viewerRef.current.render();
    }
  };

  const handleZoomOut = () => {
    if (viewerRef.current) {
      viewerRef.current.zoom(0.8);
      viewerRef.current.render();
    }
  };

  const handleReset = () => {
    if (viewerRef.current) {
      viewerRef.current.zoomTo();
      viewerRef.current.render();
      setCurrentView("default");
    }
  };

  const handlePresetView = (view) => {
    if (!viewerRef.current) return;

    const viewer = viewerRef.current;

    switch (view) {
      case "front":
        viewer.rotate(0, "x");
        viewer.rotate(0, "y");
        viewer.rotate(0, "z");
        break;
      case "side":
        viewer.rotate(0, "x");
        viewer.rotate(90, "y");
        viewer.rotate(0, "z");
        break;
      case "top":
        viewer.rotate(90, "x");
        viewer.rotate(0, "y");
        viewer.rotate(0, "z");
        break;
      default:
        break;
    }

    viewer.render();
    setCurrentView(view);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleScreenshot = () => {
    if (viewerRef.current) {
      try {
        const canvas = viewerRef.current.getCanvas();
        const link = document.createElement("a");
        link.download = `${ligandName || "molecule"}_3d_view.png`;
        link.href = canvas.toDataURL();
        link.click();
      } catch (err) {
        console.error("Screenshot failed:", err);
      }
    }
  };

  const controlButtons = [
    { icon: FiRotateCw, label: "Rotate", onClick: handleRotate },
    { icon: FiZoomIn, label: "Zoom In", onClick: handleZoomIn },
    { icon: FiZoomOut, label: "Zoom Out", onClick: handleZoomOut },
    { icon: FiRefreshCw, label: "Reset", onClick: handleReset },
    { icon: FiCamera, label: "Screenshot", onClick: handleScreenshot },
    {
      icon: isFullscreen ? FiMinimize2 : FiMaximize2,
      label: isFullscreen ? "Exit Fullscreen" : "Fullscreen",
      onClick: handleFullscreen,
    },
  ];

  const presetViews = [
    { id: "front", label: "Front", icon: FiEye },
    { id: "side", label: "Side", icon: FiMove },
    { id: "top", label: "Top", icon: FiEye },
  ];

  return (
    <motion.div
      className={`relative ${
        isFullscreen ? "fixed inset-0 z-50 bg-white" : ""
      }`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Enhanced Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {/* Main Controls */}
        <div className="flex flex-wrap gap-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-gray-200">
          {controlButtons.map((button, index) => (
            <motion.button
              key={index}
              onClick={button.onClick}
              className="p-2 bg-white hover:bg-gray-50 rounded-lg shadow-sm border border-gray-200 transition-colors group"
              title={button.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button.icon className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
            </motion.button>
          ))}
        </div>

        {/* Preset Views */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-gray-200">
          <div className="text-xs font-medium text-gray-600 mb-2 px-1">
            Preset Views
          </div>
          <div className="flex gap-1">
            {presetViews.map((view) => (
              <motion.button
                key={view.id}
                onClick={() => handlePresetView(view.id)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  currentView === view.id
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-white hover:bg-gray-50 text-gray-600 border border-gray-200"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {view.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Viewer Container */}
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: isFullscreen ? "100vh" : height,
          position: "relative",
          minHeight: isFullscreen ? "100vh" : height,
        }}
        className="border border-gray-200 rounded-lg bg-white overflow-hidden"
      />

      {/* Loading State */}
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center">
            <motion.div
              className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-sm text-gray-600">Loading 3D viewer...</p>
          </div>
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-red-50 bg-opacity-90 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center text-red-600 p-4">
            <p className="text-sm font-medium mb-2">⚠️ Viewer Error</p>
            <p className="text-xs">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Ligand Name Badge */}
      {!loading && !error && ligandName && (
        <motion.div
          className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium shadow-lg z-10"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          {ligandName}
        </motion.div>
      )}

      {/* Instructions */}
      {!loading && !error && (
        <motion.div
          className="absolute bottom-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded text-xs text-gray-600 shadow backdrop-blur-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          🖱️ Drag to rotate • 🔍 Scroll to zoom • Use controls for presets
        </motion.div>
      )}

      {/* Fullscreen Close Button */}
      {isFullscreen && (
        <motion.button
          onClick={handleFullscreen}
          className="absolute top-4 right-4 p-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors z-20"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <FiMinimize2 className="w-5 h-5" />
        </motion.button>
      )}
    </motion.div>
  );
}
