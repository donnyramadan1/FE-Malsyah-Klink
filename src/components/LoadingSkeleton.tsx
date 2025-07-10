"use client";

interface LoadingSkeletonProps {
  rows?: number;
  className?: string;
}

export function LoadingSkeleton({
  rows = 5,
  className = "space-y-4 p-6",
}: LoadingSkeletonProps) {
  return (
    <div className={className}>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 animate-pulse">
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        </div>
      ))}
    </div>
  );
}
