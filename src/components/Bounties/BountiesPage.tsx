"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { CornerRightDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BountyCard from "./BountyCard";
import BountiesSkeleton from "./BountiesSkeleton";

const BountiesPage = () => {
  const router = useRouter();

  const [bounties, setBounties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBounties = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/getBounties");
        const data = await response.json();
        setBounties(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching bounties", error);
      }
    };
    fetchBounties();
  }, []);

  return (
    <section>
      <div className="mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Bounties
          </h1>
          {bounties.length ? (
            <Button
              onClick={() => {
                router.push("/bounties/create-bounty");
              }}
            >
              Create Bounty
            </Button>
          ) : null}
        </div>
        {isLoading ? (
          <BountiesSkeleton />
        ) : bounties.length > 0 ? (
          <Tabs defaultValue="all" className="w-full space-y-6">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="live">Live</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent
              value="all"
              className="flex w-full flex-col items-center space-y-2"
            >
              {bounties.length > 0 ? (
                bounties
                  .sort((a, b) => {
                    if (a.isLive === b.isLive) {
                      return a.completed === b.completed
                        ? 0
                        : a.completed
                          ? 1
                          : -1;
                    }
                    return a.isLive ? -1 : 1;
                  })
                  .map((bounty) => <BountyCard key={bounty.id} {...bounty} />)
              ) : (
                <p>No bounties available.</p>
              )}
            </TabsContent>

            <TabsContent
              value="live"
              className="flex w-full flex-col items-center space-y-2"
            >
              {bounties.filter((bounty) => bounty.isLive && !bounty.completed)
                .length > 0 ? (
                bounties
                  .filter((bounty) => bounty.isLive && !bounty.completed)
                  .map((bounty) => <BountyCard key={bounty.id} {...bounty} />)
              ) : (
                <p>No live bounties available.</p>
              )}
            </TabsContent>

            <TabsContent
              value="completed"
              className="flex w-full flex-col items-center space-y-2"
            >
              {bounties.filter((bounty) => !bounty.isLive && bounty.completed)
                .length > 0 ? (
                bounties
                  .filter((bounty) => !bounty.isLive && bounty.completed)
                  .map((bounty) => <BountyCard key={bounty.id} {...bounty} />)
              ) : (
                <p>No bounties have been completed</p>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6">
            <p className="mt-6 text-center">
              There are no listed <br /> bounties yet.
            </p>
            <p className="flex gap-2.5">
              Click below to create one. <CornerRightDown />
            </p>
            <Button
              onClick={() => {
                router.push("/bounties/create-bounty");
              }}
            >
              Create Bounty
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BountiesPage;
