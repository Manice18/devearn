import Image from "next/image";
import { useRouter } from "next/navigation";

import { Gauge } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const BountyCard = ({
  id,
  title,
  oneLiner,
  difficulty,
  isLive,
  rewardAmount,
  rewardToken,
}: {
  id: string;
  title: string;
  oneLiner: string;
  difficulty: string;
  isLive: boolean;
  rewardAmount: number;
  rewardToken: string;
}) => {
  const router = useRouter();

  return (
    <div
      key={id}
      onClick={() => router.push(`/bounties/${id}`)}
      className="flex w-full items-center justify-between rounded-lg border-2 border-muted bg-white p-2 hover:cursor-pointer hover:bg-gray-50 dark:bg-black md:p-4"
    >
      <div className="flex items-center space-x-2 md:space-x-6">
        <div className="flex space-x-3">
          <Image
            src="/assets/icons/avatar_placeholder.png"
            alt="bounty image"
            height={20}
            width={100}
            className="size-20 rounded-lg"
          />
          <Separator orientation="vertical" className="h-[100] w-0.5" />
        </div>

        <div className="space-y-2 capitalize">
          <h3 className="text-xl font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{oneLiner}</p>
        </div>
        <div className="space-y-2 text-muted-foreground dark:text-white">
          <p className="flex items-center space-x-1 text-sm">
            <Gauge className="size-5" />
            <span className="capitalize">{difficulty.toLowerCase()}</span>
          </p>
          <p className="flex items-center space-x-2.5 pl-1.5 text-sm">
            <div
              className={cn(
                "size-2 rounded-full",
                isLive ? "bg-green-400" : "bg-red-400",
              )}
            />
            <span className="">{isLive ? "Live" : "Completed"}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 text-lg font-semibold text-black dark:text-white">
        <span>{rewardAmount}</span>
        <Avatar className="size-7">
          <AvatarImage
            src={
              rewardToken === "USDC"
                ? "https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694"
                : "https://assets.coingecko.com/coins/images/4128/standard/solana.png?1718769756"
            }
          />
          <AvatarFallback>
            {rewardToken === "USDC" ? "USDC" : "SOL"}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default BountyCard;
