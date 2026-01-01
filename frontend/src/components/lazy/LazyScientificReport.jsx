import React from "react";

// Lazy-loaded ScientificReport component
const LazyScientificReport = React.lazy(() => import("../ScientificReport"));

// Loading fallback component
function ScientificReportSkeleton() {
  return (
    <div className="space-y-6">
      {/* Quick Actions Skeleton */}
      <div className="flex gap-3 flex-wrap">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </div>

      {/* Report Sections Skeleton */}
      {[...Array(5)].map((_, sectionIndex) => (
        <div key={sectionIndex} className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
              <div>
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-48 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Content skeleton */}
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gray-200 rounded animate-pulse"
                style={{ width: `${90 - i * 10}%` }}
              />
            ))}
          </div>

          {/* Table skeleton for results section */}
          {sectionIndex === 0 && (
            <div className="mt-6 overflow-x-auto">
              <div className="min-w-full">
                {/* Header */}
                <div className="flex border-b border-gray-200 pb-3 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 h-4 bg-gray-200 rounded animate-pulse mr-4"
                    />
                  ))}
                </div>
                {/* Rows */}
                {[...Array(3)].map((_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="flex py-3 border-b border-gray-100"
                  >
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 h-3 bg-gray-200 rounded animate-pulse mr-4"
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Wrapper component with Suspense
export default function LazyScientificReportWrapper(props) {
  return (
    <React.Suspense fallback={<ScientificReportSkeleton />}>
      <LazyScientificReport {...props} />
    </React.Suspense>
  );
}
