import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { format } from "date-fns";
import { CircleCheck, Grab } from "lucide-react";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  acceptBountySubmission,
  claimRewardAction,
  getBountySubmissions,
} from "@/actions";
import { useEscrow } from "@/hooks/useEscrow";
import BountySubmissionSkeleton from "./bounty-submission-skeleton";

type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type BountySubmission = {
  id: string;
  bountyId: string;
  userId: string;
  submissionDetails: string;
  isAccepted: boolean;
  createdAt: Date;
  claimedReward?: boolean | null;
  user: User;
};

const ListBountySubmission = ({
  bountyId,
  bountyUserId,
  setTrackUserSubmission,
  escrowAddress,
  bountyAmount,
  bountyCompleted,
}: {
  bountyId: string;
  bountyUserId?: string;
  setTrackUserSubmission?: any;
  escrowAddress?: string;
  bountyAmount?: number;
  bountyCompleted?: boolean;
}) => {
  const { publicKey, connected } = useWallet();
  const session = useSession();

  const { takerEscrow } = useEscrow();

  const [bountySubmissions, setBountySubmissions] = useState<
    BountySubmission[] | null
  >();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchBountySubmissions = async () => {
    try {
      const response = await getBountySubmissions(bountyId);
      response.forEach((submission: any) => {
        if (submission.userId === session.data?.user?.id) {
          setTrackUserSubmission(false);
        }
      });
      setBountySubmissions(response);
    } catch (error) {
      console.error("Error fetching bounty submissions", error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchBountySubmissions();
    setIsLoading(false);
  }, []);

  const handleAcceptSubmission = async (
    bountyId: string,
    submissionId: string,
    winAmount: number,
    submissionUserId: string,
  ) => {
    try {
      await acceptBountySubmission(
        submissionId,
        bountyId,
        winAmount,
        submissionUserId,
      );
      toast.success("Submission accepted");
      fetchBountySubmissions();
    } catch (e) {
      console.error(e);
      toast.error("Error accepting submission");
    }
  };

  const handleReward = async (
    escrow: PublicKey,
    amount: number,
    submissionId: string,
  ) => {
    if (!publicKey || !connected) {
      toast.error("Please connect your wallet first");
      return;
    }
    try {
      let promise: any;
      promise = new Promise<void>(async (resolve, reject) => {
        await takerEscrow(escrow, amount)
          .then(async () => {
            await claimRewardAction(submissionId);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
      toast.promise(promise, {
        loading: "Claiming reward...",
        success: "Reward claimed",
        error: "Rejected claiming reward",
      });
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-10">
        {[1, 2, 3, 4].map((index) => (
          <BountySubmissionSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1
        className={cn(
          "text-3xl font-bold",
          session.data?.user?.id === bountyUserId && "hidden",
        )}
      >
        Submissions
      </h1>
      {bountySubmissions?.length === 0 && (
        <div>
          No submissions yet.{" "}
          <span
            className={cn(session.data?.user?.id === bountyUserId && "hidden")}
          >
            Be the first to submit
          </span>
        </div>
      )}
      {bountySubmissions?.map((submission, index) => (
        <div
          key={submission.id}
          className={cn(
            "border-t p-4 last:border-b",
            index === 0 && "border-t-0",
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Link href={`https://github.com/${submission.user.name}`}>
                <Image
                  src={submission.user.image!}
                  alt="user"
                  width={50}
                  height={50}
                  className="h-8 w-8 rounded-full"
                />
              </Link>
              <p className="text-black dark:text-white">
                {submission.user.name}
              </p>
            </div>
            {session.data?.user?.id === bountyUserId && !bountyCompleted && (
              <Button
                className="w-24"
                onClick={() => {
                  handleAcceptSubmission(
                    bountyId,
                    submission.id,
                    bountyAmount!,
                    submission.userId,
                  );
                }}
              >
                Accept
              </Button>
            )}
            {submission.isAccepted && (
              <div className="flex space-x-2">
                <div className="flex items-center space-x-1 rounded-full bg-green-100 px-3 py-2 text-sm ring-[1.5px] ring-green-200">
                  <CircleCheck className="size-4 text-red-800" />{" "}
                  <span className="font-medium">Accepted</span>
                </div>
                {submission.userId === session.data?.user?.id &&
                  !submission.claimedReward && (
                    <Button
                      onClick={() => {
                        handleReward(
                          new PublicKey(escrowAddress!),
                          bountyAmount!,
                          submission.id,
                        );
                      }}
                    >
                      <Grab />
                    </Button>
                  )}
              </div>
            )}
          </div>

          <div
            className="my-2 px-10 text-black dark:text-white"
            dangerouslySetInnerHTML={{ __html: submission.submissionDetails }}
          />
          <p className="text-end">
            <span className="font-medium">Submitted At:</span>{" "}
            <span>{format(new Date(submission.createdAt), "dd MMM yyyy")}</span>
          </p>
        </div>
      ))}
    </div>
  );
};

export default ListBountySubmission;
