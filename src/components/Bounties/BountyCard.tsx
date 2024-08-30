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
  githubRepo,
  githubIssue,
}: {
  id: string;
  title: string;
  oneLiner: string;
  difficulty: string;
  isLive: boolean;
  rewardAmount: number;
  rewardToken: string;
  githubRepo: string;
  githubIssue: string;
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
          <p className="w-[210px] text-sm text-muted-foreground">
            {oneLiner.length > 30
              ? oneLiner.substring(0, 26) + "..."
              : oneLiner}
          </p>
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
        <div className="space-y-2">
          <p className="flex space-x-2">
            <span>
              <svg
                fill="currentColor"
                width="22"
                height="22"
                viewBox="0 0 64 64"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M32 1.7998C15 1.7998 1 15.5998 1 32.7998C1 46.3998 9.9 57.9998 22.3 62.1998C23.9 62.4998 24.4 61.4998 24.4 60.7998C24.4 60.0998 24.4 58.0998 24.3 55.3998C15.7 57.3998 13.9 51.1998 13.9 51.1998C12.5 47.6998 10.4 46.6998 10.4 46.6998C7.6 44.6998 10.5 44.6998 10.5 44.6998C13.6 44.7998 15.3 47.8998 15.3 47.8998C18 52.6998 22.6 51.2998 24.3 50.3998C24.6 48.3998 25.4 46.9998 26.3 46.1998C19.5 45.4998 12.2 42.7998 12.2 30.9998C12.2 27.5998 13.5 24.8998 15.4 22.7998C15.1 22.0998 14 18.8998 15.7 14.5998C15.7 14.5998 18.4 13.7998 24.3 17.7998C26.8 17.0998 29.4 16.6998 32.1 16.6998C34.8 16.6998 37.5 16.9998 39.9 17.7998C45.8 13.8998 48.4 14.5998 48.4 14.5998C50.1 18.7998 49.1 22.0998 48.7 22.7998C50.7 24.8998 51.9 27.6998 51.9 30.9998C51.9 42.7998 44.6 45.4998 37.8 46.1998C38.9 47.1998 39.9 49.1998 39.9 51.9998C39.9 56.1998 39.8 59.4998 39.8 60.4998C39.8 61.2998 40.4 62.1998 41.9 61.8998C54.1 57.7998 63 46.2998 63 32.5998C62.9 15.5998 49 1.7998 32 1.7998Z" />
              </svg>{" "}
            </span>
            <span className="font-medium">Repo:</span>
            <span>{githubRepo}</span>
          </p>
          <p className="flex space-x-2">
            <span>
              <svg
                fill="currentColor"
                width="22"
                height="22"
                viewBox="0 0 64 64"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M32 1.7998C15 1.7998 1 15.5998 1 32.7998C1 46.3998 9.9 57.9998 22.3 62.1998C23.9 62.4998 24.4 61.4998 24.4 60.7998C24.4 60.0998 24.4 58.0998 24.3 55.3998C15.7 57.3998 13.9 51.1998 13.9 51.1998C12.5 47.6998 10.4 46.6998 10.4 46.6998C7.6 44.6998 10.5 44.6998 10.5 44.6998C13.6 44.7998 15.3 47.8998 15.3 47.8998C18 52.6998 22.6 51.2998 24.3 50.3998C24.6 48.3998 25.4 46.9998 26.3 46.1998C19.5 45.4998 12.2 42.7998 12.2 30.9998C12.2 27.5998 13.5 24.8998 15.4 22.7998C15.1 22.0998 14 18.8998 15.7 14.5998C15.7 14.5998 18.4 13.7998 24.3 17.7998C26.8 17.0998 29.4 16.6998 32.1 16.6998C34.8 16.6998 37.5 16.9998 39.9 17.7998C45.8 13.8998 48.4 14.5998 48.4 14.5998C50.1 18.7998 49.1 22.0998 48.7 22.7998C50.7 24.8998 51.9 27.6998 51.9 30.9998C51.9 42.7998 44.6 45.4998 37.8 46.1998C38.9 47.1998 39.9 49.1998 39.9 51.9998C39.9 56.1998 39.8 59.4998 39.8 60.4998C39.8 61.2998 40.4 62.1998 41.9 61.8998C54.1 57.7998 63 46.2998 63 32.5998C62.9 15.5998 49 1.7998 32 1.7998Z" />
              </svg>{" "}
            </span>
            <span className="font-medium">Issue:</span>
            <span>{githubIssue}</span>
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
