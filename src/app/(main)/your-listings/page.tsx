import Link from "next/link";

import { Button } from "@/components/ui/button";
import YourListings from "@/components/YourListings/YourListings";
import { constructMetaData } from "@/lib/metadata";

export const metadata = constructMetaData({
  title: "Your Listings | DevEarn",
  description: "This is the Your Listings Page for DevEarn",
});

const Listings = () => {
  return (
    <section>
      <div className="mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Your Listings
          </h1>
          <Link href="/bounties/create-bounty">
            <Button>Create Bounty</Button>
          </Link>
        </div>
        <YourListings />
      </div>
    </section>
  );
};

export default Listings;
