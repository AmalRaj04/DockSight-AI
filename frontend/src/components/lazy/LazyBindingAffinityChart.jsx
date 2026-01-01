import React from "react";

// Lazy-loaded BindingAffinityChart component
const LazyBindingAffinityChart = React.lazy(() =>
  import("../BindingAffinityChart")
);

// Loading fallback component
function BindingAffinityChartSkeleton() {
  return (
    <div className="glass rounded-xl p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
        <div>
          <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Chart skeleton */}
      <div className="h-80 bg-gray-100 rounded-lg animate-pulse mb-6 relative overflow-hidden">
        {/* Mock bars */}
        <div className="absolute bottom-12 left-12 right-12 flex items-end justify-between gap-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-300 rounded-t animate-pulse"
              style={{
                width: "40px",
                height: `${Math.random() * 150 + 50}px`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>

        {/* Loading indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-purple-500 rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-600">Loading chart...</p>
          </div>
        </div>
      </div>

      {/* Legend skeleton */}
      <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-200">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 rounded animate-pulse" />
            <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-6 bg-gray-200 rounded-full animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Wrapper component with Suspense
export default function LazyBindingAffinityChartWrapper(props) {
  return (
    <React.Suspense fallback={<BindingAffinityChartSkeleton />}>
      <LazyBindingAffinityChart {...props} />
    </React.Suspense>
  );
}
