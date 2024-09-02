import { Skeleton } from "@/components/ui/skeleton";

export default function BountySubmissionSkeleton() {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex space-x-2">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="mt-2 h-4 w-[200px]" />
      </div>
      <Skeleton className="ml-14 h-6 w-[250px]" />
      <Skeleton className="ml-14 h-0.5 w-full" />
    </div>
  );
}
