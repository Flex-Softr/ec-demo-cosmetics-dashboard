import ContentCard from "@/components/contentCard/ContentCard";
import { Skeleton } from "@/components/ui/skeleton";

const OrderDetailsSkeleton = () => {
  return (
    <div className="mb-8 space-y-5 p-4 sm:p-6">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
        </div>
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>

      <div className="flex flex-col gap-5 lg:flex-row">
        {/* Main card */}
        <ContentCard className="min-w-0 flex-1 space-y-5 lg:w-[70%]">
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-3 w-52" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-20 rounded-lg" />
              <Skeleton className="h-9 w-20 rounded-lg" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="space-y-3 md:col-span-2 md:grid md:grid-cols-2 md:gap-8">
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-44" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-28" />
              </div>
              <div className="md:col-span-2">
                <Skeleton className="h-4 w-full max-w-md" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border">
            <div className="space-y-3 bg-muted p-4">
              <div className="grid grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-3 w-full" />
                ))}
              </div>
            </div>
            <div className="space-y-4 p-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="grid grid-cols-5 items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <Skeleton className="col-span-2 h-4 w-full" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-14" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <div className="w-full space-y-2 sm:w-1/3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
        </ContentCard>

        {/* Sidebar */}
        <ContentCard className="w-full space-y-5 lg:w-[30%]">
          <div className="space-y-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </ContentCard>
      </div>
    </div>
  );
};

export default OrderDetailsSkeleton;
