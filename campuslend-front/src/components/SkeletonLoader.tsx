/**
 * Skeleton loaders for perceived performance during data fetching.
 * Renders placeholder cards that pulse while content loads.
 * Layout matches ItemCard (rounded-3xl, glass, 4-column grid at xl).
 */

const SkeletonCard = () => (
  <div className="glass bg-white rounded-3xl p-6 shadow-medium border border-gray-100 animate-pulse" aria-hidden="true">
    <div className="space-y-5">
      <div className="space-y-4">
        {/* Category badge + status badge skeleton */}
        <div className="flex justify-between items-center">
          <div className="h-6 w-24 bg-gray-200 rounded-full" />
          <div className="h-6 w-20 bg-gray-200 rounded-full" />
        </div>
        {/* Title skeleton */}
        <div className="h-6 w-3/4 bg-gray-200 rounded" />
        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-100 rounded" />
          <div className="h-4 w-2/3 bg-gray-100 rounded" />
        </div>
        {/* Meta info skeleton */}
        <div className="space-y-2.5">
          <div className="flex items-center space-x-3 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
            <div className="h-5 w-5 bg-gray-200 rounded-lg" />
            <div className="h-4 w-20 bg-gray-100 rounded" />
          </div>
          <div className="flex items-center space-x-3 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
            <div className="h-5 w-5 bg-gray-200 rounded-lg" />
            <div className="h-4 w-28 bg-gray-100 rounded" />
          </div>
        </div>
        {/* Button skeleton */}
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
          <div className="h-11 w-full bg-gray-200 rounded-xl" />
          <div className="h-11 w-full bg-gray-100 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

interface SkeletonGridProps {
  count?: number;
}

const SkeletonGrid = ({ count = 8 }: SkeletonGridProps) => (
  <div
    className="w-full max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    role="status"
    aria-busy="true"
    aria-label="Loading items"
  >
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export { SkeletonCard, SkeletonGrid };
export default SkeletonGrid;
