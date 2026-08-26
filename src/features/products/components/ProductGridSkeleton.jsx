import { Skeleton } from '@/shared/ui/Skeleton'

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div
      aria-label="Loading products"
      className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      role="status"
    >
      {Array.from({ length: count }, (_, index) => (
        <div aria-hidden="true" key={index}>
          <Skeleton className="aspect-square w-full rounded-lg" />
          <Skeleton className="mt-4 h-3 w-20" />
          <div className="mt-2 flex justify-between gap-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}
