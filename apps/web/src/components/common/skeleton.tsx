import React from "react";

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export function Skeleton({ className = "", children }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 ${className}`}
      role="status"
      aria-label="Carregando..."
    >
      <span className="sr-only">Carregando...</span>
      {children}
    </div>
  );
}

// Skeletons específicos para diferentes contextos
export function AvatarSkeleton() {
  return <Skeleton className="h-10 w-10 rounded-full" />;
}

export function CardSkeleton() {
  return (
    <Skeleton className="h-32 w-full">
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      </div>
    </Skeleton>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className={`h-4 ${
                colIndex === 0
                  ? "w-3/4"
                  : colIndex === 1
                    ? "w-full"
                    : colIndex === 2
                      ? "w-1/2"
                      : "w-1/3"
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function NavItemSkeleton() {
  return (
    <div className="flex items-center gap-2 rounded-md p-2 text-sm">
      <Skeleton className="size-4" />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="space-y-6">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-6 w-32" />
      </div>

      {/* Navigation */}
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <NavItemSkeleton key={i} />
        ))}
      </div>

      {/* User section */}
      <div className="mt-auto">
        <div className="flex items-center space-x-3 p-2">
          <AvatarSkeleton />
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ListSkeleton({ items = 3 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <AvatarSkeleton />
          <div className="space-y-1 flex-1">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}
