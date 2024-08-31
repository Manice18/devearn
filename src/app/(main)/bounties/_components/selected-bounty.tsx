"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { format } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import BountySubmissionForm from "./bounty-submission-form";
import ListBountySubmission from "./list-bounty-submission";

const SelectedBounty = ({ bountyId }: { bountyId: string }) => {
  const [bounty, setBounty] = useState<any>(null);
  const [trackUserSubmission, setTrackUserSubmission] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const session = useSession();

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

  useEffect(() => {
    fetchBounty(bountyId);
  }, []);

  const handleSubmissionSuccess = () => {
    // Re-fetch the bounty to get the updated submissions
    fetchBounty(bountyId);
  };

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
            </h1>
            <p className="text-sm text-muted-foreground">
              Created by: <span>{bounty.createdBy}</span>
            </p>
          </div>
          <div className="flex items-center space-x-1 text-lg font-bold text-black dark:text-white">
            <span>{bounty.rewardAmount}</span>
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
                {/* {"USDC" === "USDC" ? "USDC" : "SOL"} */}
                {bounty.rewardToken === "USDC" ? "USDC" : "SOL"}
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold">
              {/* {"USDC" === "USDC" ? "USDC" : "SOL"} */}
              {bounty.rewardToken === "USDC" ? "USDC" : "SOL"}
            </span>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          {/* <p className="text-black dark:text-white">{bounty.description}</p> */}
          <h2 className="text-xl font-bold">Description</h2>
          <div
            className="text-black dark:text-white"
            dangerouslySetInnerHTML={{ __html: bounty.description }}
          />
          <p className="ml-auto">
            <span className="font-medium">Created At:</span>{" "}
            <span>{format(new Date(bounty.createdAt), "dd MMM yyyy")}</span>
          </p>
        </div>
        <Separator className="w-full" />
        {session.data?.user?.id === bounty.userId ? (
          <div>
            <h1 className="text-3xl font-bold">Submissions</h1>
            <ListBountySubmission
              bountyId={bounty.id}
              bountyUserId={bounty.userId}
              bountyAmount={bounty.rewardAmount}
            />
          </div>
        ) : (
          <div>
            <ListBountySubmission
              bountyId={bounty.id}
              bountyUserId={bounty.userId}
              setTrackUserSubmission={setTrackUserSubmission}
              bountyAmount={bounty.rewardAmount}
              escrowAddress={bounty.escrowAddress}
            />
            {trackUserSubmission && (
              <>
                <h2 className="mt-4 text-xl font-bold">Post Your Submission</h2>
                <BountySubmissionForm
                  bountyId={bounty.id}
                  onSubmissionSuccess={handleSubmissionSuccess}
                />
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default SelectedBounty;
