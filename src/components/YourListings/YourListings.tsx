"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";
import { CornerRightDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { yourListingAction } from "@/actions";
import ListingTable from "./ListingTable";

const YourListings = () => {
  const session = useSession();
  const router = useRouter();

  const [bounties, setBounties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchBounties = async () => {
      const response = await yourListingAction(session?.data?.user.id);
      setBounties(response);
    };

    fetchBounties();
    setIsLoading(false);
  }, []);

  return isLoading ? (
    <div>Loading...</div>
  ) : bounties.length > 0 ? (
    <div>
      <ListingTable />
    </div>
  ) : (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6">
      <p className="mt-6 text-center">
        You have not listed <br /> any bounties yet.
      </p>
      <p className="flex gap-2.5">
        Click below to list your own. <CornerRightDown />
      </p>
      <Button
        onClick={() => {
          router.push("/bounties/create-bounty");
        }}
      >
        Create Bounty
      </Button>
    </div>
  );
};

export default YourListings;
