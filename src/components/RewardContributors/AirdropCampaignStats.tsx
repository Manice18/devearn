"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";
import { CornerRightDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { fetchAllCampaignsAction } from "@/actions";
import AirdropCampaignTable from "./AirdropCampaignTable";

type AirdropCampaign = {
  id: string;
  airdropCampaignName: string;
  blinkLink: string | null;
  gitHubRepo: string;
  totalContributors: number;
  tokenMintAddress: string;
  totalAllocatedAmount: number;
  totalClaimedAmount: number | null;
  escrowAddress: string | null;
  eachContributorAmount: number;
  userId: string;
  noOfTimesClaimed: number | null;
};

const AidropCampaignStats = () => {
  const session = useSession();
  const router = useRouter();

  const [airdrops, setAirdrops] = useState<AirdropCampaign[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchAirdrops = async () => {
      const response = await fetchAllCampaignsAction(session?.data?.user.id);
      console.log(response);
      setAirdrops(response);
    };

    fetchAirdrops();
    setIsLoading(false);
  }, []);

  return isLoading ? (
    <div>Loading...</div>
  ) : airdrops.length > 0 ? (
    <div>
      <AirdropCampaignTable airdrop={airdrops} />
      {/* <ListingTable /> */}
    </div>
  ) : (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6">
      <p className="mt-6 text-center">
        You have not created <br /> any airdrop campaigns yet.
      </p>
      <p className="flex gap-2.5">
        Click below to create one. <CornerRightDown />
      </p>
      <Button
        onClick={() => {
          router.push("/reward-contributors/create-airdrop-campaign");
        }}
      >
        Create Airdrop Campaign
      </Button>
    </div>
  );
};

export default AidropCampaignStats;
