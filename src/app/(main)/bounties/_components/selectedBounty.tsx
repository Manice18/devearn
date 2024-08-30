"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import BountySubmissionForm from "./bountySubmissionForm";
import ListBountySubmission from "./list-bounty-submission";

const SelectedBounty = ({ bountyId }: { bountyId: string }) => {
  const [bounty, setBounty] = useState<any>(null);
  const [trackUserSubmission, setTrackUserSubmission] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const session = useSession();

  useEffect(() => {
    const fetchBounty = async (id: string) => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/getBounties?id=${id}`);
        const data = await response.json();
        setBounty(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching bounty", error);
      }
    };
    fetchBounty(bountyId);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section>
      <div className="mx-auto space-y-6">
        <div className="flex justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold capitalize text-black dark:text-white">
              {bounty.title}
              {/* Bounty Title */}
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
        {session.data?.user?.id === bounty.userId ? (
          <div>
            <h1>Submissions</h1>
            <ListBountySubmission
              bountyId={bounty.id}
              bountyUserId={bounty.userId}
            />
          </div>
        ) : (
          <div>
            {/* TODO:Enable functionality for making submissions visible to everyone */}
            <ListBountySubmission
              bountyId={bounty.id}
              bountyUserId={bounty.userId}
              setTrackUserSubmission={setTrackUserSubmission}
            />
            {trackUserSubmission && (
              <>
                <h2 className="mt-4">Post Your Submission</h2>
                <BountySubmissionForm bountyId={bounty.id} />
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default SelectedBounty;
