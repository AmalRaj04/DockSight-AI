import React from "react";

// Lazy-loaded MolecularViewer3D component
const LazyMolecularViewer3D = React.lazy(() => import("../MolecularViewer3D"));

// Loading fallback component
function MolecularViewerSkeleton() {
  return (
    <div
      className="relative bg-gray-100 rounded-lg animate-pulse"
      style={{ height: "400px" }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-600 font-medium">
            Loading 3D Viewer...
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Initializing molecular visualization
          </p>
        </div>
      </div>

      {/* Mock controls */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <div className="flex gap-2 bg-white/90 rounded-lg p-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="w-8 h-8 bg-gray-200 rounded animate-pulse"
            />
          ))}
        </div>
        <div className="bg-white/90 rounded-lg p-2">
          <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse" />
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-12 h-6 bg-gray-200 rounded animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrapper component with Suspense
export default function LazyMolecularViewer3DWrapper(props) {
  return (
    <React.Suspense fallback={<MolecularViewerSkeleton />}>
      <LazyMolecularViewer3D {...props} />
    </React.Suspense>
  );
}
