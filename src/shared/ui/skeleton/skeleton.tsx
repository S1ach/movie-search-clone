interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-200/70 ${className}`}
    />
  );
}

export function TicketCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4 flex-1">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <div className="flex items-center gap-6 flex-1 justify-center">
          <div className="text-center space-y-2">
            <Skeleton className="h-5 w-14" />
            <Skeleton className="h-3 w-10" />
          </div>
          <div className="flex-1 max-w-[120px] space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
          <div className="text-center space-y-2">
            <Skeleton className="h-5 w-14" />
            <Skeleton className="h-3 w-10" />
          </div>
        </div>
        <div className="flex items-center gap-4 flex-1 justify-end">
          <div className="text-right space-y-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-3 w-16 ml-auto" />
          </div>
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
