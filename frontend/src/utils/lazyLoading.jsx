import React, { useState, useEffect, useRef } from "react";

/**
 * Lazy Loading Utilities
 * Provides intersection observer and lazy loading functionality
 */

/**
 * Custom hook for intersection observer
 * @param {Object} options - Intersection observer options
 * @returns {Array} [ref, isIntersecting, entry]
 */
export function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState(null);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        setEntry(entry);
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [options.threshold, options.rootMargin]);

  return [elementRef, isIntersecting, entry];
}

/**
 * Lazy Image Component with intersection observer
 */
export function LazyImage({
  src,
  alt,
  className = "",
  placeholder = null,
  onLoad = () => {},
  onError = () => {},
  ...props
}) {
  const [imageRef, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "100px",
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad();
  };

  const handleError = () => {
    setHasError(true);
    onError();
  };

  return (
    <div ref={imageRef} className={`relative ${className}`} {...props}>
      {isIntersecting && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          } ${className}`}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}

      {/* Placeholder while loading */}
      {(!isIntersecting || (!isLoaded && !hasError)) && (
        <div
          className={`absolute inset-0 bg-gray-200 animate-pulse ${className}`}
        >
          {placeholder || (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            </div>
          )}
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div
          className={`absolute inset-0 bg-gray-100 flex items-center justify-center ${className}`}
        >
          <div className="text-center text-gray-500">
            <svg
              className="w-8 h-8 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <p className="text-xs">Failed to load</p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Lazy Section Component for below-the-fold content
 */
export function LazySection({
  children,
  className = "",
  placeholder = null,
  threshold = 0.1,
  rootMargin = "50px",
  ...props
}) {
  const [sectionRef, isIntersecting] = useIntersectionObserver({
    threshold,
    rootMargin,
  });

  return (
    <div ref={sectionRef} className={className} {...props}>
      {isIntersecting
        ? children
        : placeholder || (
            <div className="h-64 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm">Loading content...</p>
              </div>
            </div>
          )}
    </div>
  );
}

/**
 * Preload critical resources
 */
export function preloadCriticalAssets() {
  // Preload critical images
  const criticalImages = [
    // Add paths to critical images that should be preloaded
  ];

  criticalImages.forEach((src) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = src;
    document.head.appendChild(link);
  });
}

/**
 * Lazy load component with dynamic import
 */
export function createLazyComponent(importFn, fallback = null) {
  const LazyComponent = React.lazy(importFn);

  return function LazyWrapper(props) {
    return (
      <React.Suspense fallback={fallback || <ComponentLoadingSpinner />}>
        <LazyComponent {...props} />
      </React.Suspense>
    );
  };
}

/**
 * Default loading spinner for lazy components
 */
function ComponentLoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-2" />
        <p className="text-sm text-gray-600">Loading component...</p>
      </div>
    </div>
  );
}
