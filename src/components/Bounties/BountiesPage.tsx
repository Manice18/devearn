"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { CornerRightDown, Gauge } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";

const BountiesPage = () => {
  const router = useRouter();

  const [bounties, setBounties] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /* This useEffect is for testing*/
  //   useEffect(() => {
  //     setBounties([
  //       {
  //         id: "1",
  //         title: "Bounty 1",
  //         description: "Description 1",
  //         reward: "Reward 1",
  //         deadline: "Deadline 1",
  //       },
  //       {
  //         id: "2",
  //         title: "Bounty 2",
  //         description: "Description 2",
  //         reward: "Reward 2",
  //         deadline: "Deadline 2",
  //       },
  //     ]);
  //     setIsLoading(false);
  //   }, []);

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
          ) : (
            <></>
          )}
        </div>
        {isLoading ? (
          <div>Loading...</div>
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
              {bounties.map((bounty: any) => (
                <div
                  key={bounty.id}
                  onClick={() => router.push(`/bounties/${bounty.id}`)}
                  className="flex w-full items-center justify-between rounded-lg border-2 border-muted bg-white p-2 dark:bg-black md:p-4"
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
                      <Separator
                        orientation="vertical"
                        className="h-[100] w-0.5"
                      />
                    </div>

                    <div className="space-y-2 capitalize">
                      <h3 className="text-xl font-medium">{bounty.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {bounty.oneLiner}
                      </p>
                    </div>
                    <div className="space-y-2 text-muted-foreground dark:text-white">
                      <p className="flex items-center space-x-1 text-sm">
                        <Gauge className="size-5" />
                        <span className="capitalize">
                          {bounty.difficulty.toLowerCase()}
                        </span>
                      </p>
                      <p className="flex items-center space-x-2.5 pl-1.5 text-sm">
                        <div
                          className={cn(
                            "size-2 rounded-full",
                            bounty.isLive ? "bg-green-400" : "bg-red-400",
                          )}
                        />
                        <span className="">
                          {bounty.isLive ? "Live" : "Completed"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-lg font-semibold text-black dark:text-white">
                    <span>{bounty.rewardAmount}</span>
                    <Avatar className="size-7">
                      <AvatarImage
                        src={
                          bounty.rewardToken === "USDC"
                            ? "https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694"
                            : "https://assets.coingecko.com/coins/images/4128/standard/solana.png?1718769756"
                        }
                      />
                      <AvatarFallback>
                        {bounty.rewardToken === "USDC" ? "USDC" : "SOL"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="live">
              Live bounties will be shown here.
            </TabsContent>
            <TabsContent value="completed">
              Completed bounties will be shown here.
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
            <Button>Create Bounty</Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BountiesPage;
