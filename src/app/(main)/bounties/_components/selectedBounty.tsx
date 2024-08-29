"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useOrigin from "@/hooks/use-origin";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const SelectedBounty = ({ bountyId }: { bountyId: string }) => {
  const [bounty, setBounty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  //   useEffect(() => {
  //     const fetchBounty = async (id: string) => {
  //       try {
  //         setIsLoading(true);
  //         const response = await fetch(`/api/getBounties?id=${id}`);
  //         const data = await response.json();
  //         setBounty(data);
  //         console.log(data);
  //         setIsLoading(false);
  //       } catch (error) {
  //         console.error("Error fetching bounty", error);
  //       }
  //     };
  //     fetchBounty(bountyId);
  //   }, []);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <section>
      <div className="mx-auto space-y-6">
        <div className="flex justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-black dark:text-white">
              {/* {bounty.title} */}
              Bounty Title
            </h1>
            <p className="text-sm text-muted-foreground">
              Created by: <span>{/*bounty.createdBy*/}Username</span>
            </p>
          </div>
          <div className="flex items-center space-x-1 text-lg font-bold text-black dark:text-white">
            <span>{/*bounty.rewardAmount*/}100</span>
            <Avatar className="size-7">
              {/*bounty.rewardToken*/}
              <AvatarImage
                src={
                  "USDC" === "USDC"
                    ? "https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694"
                    : "https://assets.coingecko.com/coins/images/4128/standard/solana.png?1718769756"
                }
              />
              <AvatarFallback>
                {"USDC" === "USDC" ? "USDC" : "SOL"}
                {/* {bounty.rewardToken === "USDC" ? "USDC" : "SOL"} */}
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold">
              {"USDC" === "USDC" ? "USDC" : "SOL"}
            </span>
          </div>
        </div>
        <div>
          <p className="text-black dark:text-white">
            {/* {bounty.description} */}
            Bounty Description
          </p>
        </div>
      </div>
    </section>
  );
};

export default SelectedBounty;
