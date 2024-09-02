import { Skeleton } from "@/components/ui/skeleton";

export default function SelectedBountySkeleton() {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-[250px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
        <Skeleton className="h-6 w-[100px]" />
      </div>
      <Skeleton className="h-[500px] w-full rounded-lg" />
      <Skeleton className="h-0.5 w-full" />
    </div>
  );
}
