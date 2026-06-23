import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded bg-cream/60',
        className
      )}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="group">
      <Skeleton className="aspect-square w-full mb-4" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-2" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  )
}

export function WorkshopCardSkeleton() {
  return (
    <div className="border border-cream">
      <Skeleton className="aspect-video w-full" />
      <div className="p-6">
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}
