import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { getBountySubmissions } from "@/actions";
import Image from "next/image";
import { useSession } from "next-auth/react";

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
  user: User;
};

const ListBountySubmission = ({
  bountyId,
  bountyUserId,
  setTrackUserSubmission,
}: {
  bountyId: string;
  bountyUserId?: string;
  setTrackUserSubmission?: any;
}) => {
  const session = useSession();

  const [bountySubmissions, setBountySubmissions] = useState<
    BountySubmission[] | null
  >();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
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
    fetchBountySubmissions();
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {bountySubmissions?.length === 0 && (
        <div>No submissions yet. Be the first to submit</div>
      )}
      {bountySubmissions?.map((submission) => (
        <div key={submission.id}>
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Image
                src={submission.user.image!}
                alt="user"
                width={50}
                height={50}
                className="h-8 w-8 rounded-full"
              />
              <p className="text-black dark:text-white">
                {submission.user.name}
              </p>
            </div>
            {session.data?.user?.id === bountyUserId && (
              <Button className="w-24">Accept</Button>
            )}
          </div>
          <p className="text-black dark:text-white">
            {submission.submissionDetails}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ListBountySubmission;
