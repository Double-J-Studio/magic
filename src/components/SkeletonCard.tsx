import { Skeleton } from "@/components/ui/skeleton";

const SkeletonCard = () => {
  return (
    <div className="flex space-y-3">
      <Skeleton className="min-w-[200px] w-full h-[300px] rounded-xl" />
    </div>
  );
};

export default SkeletonCard;
