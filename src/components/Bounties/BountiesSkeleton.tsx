import { Skeleton } from "../ui/skeleton";

const BountiesSkeleton = () => {
  return (
    <div className="flex flex-col space-y-3">
      {[1, 2, 3, 4].map((id) => (
        <Skeleton
          className="mx-auto h-[80px] w-full rounded-lg bg-gray-200"
          key={id}
        />
      ))}
    </div>
  );
};

export default BountiesSkeleton;
