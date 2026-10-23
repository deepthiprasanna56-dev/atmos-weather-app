export default function SkeletonLoader() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Search Bar Skeleton */}
      <div className="mx-auto h-12 w-full max-w-3xl rounded-2xl bg-white/40 dark:bg-slate-800/40 shimmer-effect" />

      {/* Hero Card Skeleton */}
      <div className="rounded-3xl border border-white/20 bg-white/40 p-6 shadow-xl backdrop-blur-xl dark:border-white/5 dark:bg-slate-900/40 sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="space-y-4">
            <div className="h-6 w-32 rounded-full bg-slate-300/60 dark:bg-slate-700/60 shimmer-effect" />
            <div className="h-12 w-64 rounded-xl bg-slate-300/60 dark:bg-slate-700/60 shimmer-effect" />
            <div className="h-4 w-44 rounded-lg bg-slate-300/40 dark:bg-slate-700/40 shimmer-effect" />
          </div>
          <div className="flex items-center gap-6">
            <div className="space-y-2 text-right">
              <div className="h-16 w-32 rounded-2xl bg-slate-300/60 dark:bg-slate-700/60 shimmer-effect" />
              <div className="h-4 w-28 rounded-lg bg-slate-300/40 dark:bg-slate-700/40 shimmer-effect" />
            </div>
            <div className="h-28 w-28 rounded-3xl bg-slate-300/50 dark:bg-slate-700/50 shimmer-effect" />
          </div>
        </div>
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-2xl border border-white/20 bg-white/40 p-4 dark:border-white/5 dark:bg-slate-900/40 shimmer-effect"
          />
        ))}
      </div>

      {/* Sunrise & Sunset skeleton */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        <div className="h-20 rounded-2xl border border-white/20 bg-white/40 p-4 dark:border-white/5 dark:bg-slate-900/40 shimmer-effect" />
        <div className="h-20 rounded-2xl border border-white/20 bg-white/40 p-4 dark:border-white/5 dark:bg-slate-900/40 shimmer-effect" />
      </div>

      {/* Hourly Skeleton */}
      <div className="h-48 rounded-3xl border border-white/20 bg-white/40 p-6 dark:border-white/5 dark:bg-slate-900/40 shimmer-effect" />

      {/* Daily Skeleton */}
      <div className="h-72 rounded-3xl border border-white/20 bg-white/40 p-6 dark:border-white/5 dark:bg-slate-900/40 shimmer-effect" />
    </div>
  );
}
