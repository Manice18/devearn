"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import { MoveRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWallet } from "@solana/wallet-adapter-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  RewardContributorFormType,
  rewardContributorSchema,
} from "@/lib/validation";
import { useEscrow } from "@/hooks/useEscrow";
import { createAirdropCampaignAction } from "@/actions";

interface Contributors {
  id: number;
  login: string;
  contributions: number;
}

const CreateAirdropCampaignForm = () => {
  const { publicKey, connected } = useWallet();
  const router = useRouter();

  const { makeEscrow } = useEscrow();

  const [repos, setRepos] = useState<Contributors[]>([]);
  const [totalContributors, setTotalContributors] = useState<number | null>(
    null,
  );

  const fetchRepos = async (userRepo: string) => {
    try {
      const repoPath = userRepo
        .replace("https://github.com/", "")
        .replace(/\/$/, "");
      const response = await axios.get<Contributors[]>(
        `https://api.github.com/repos/${repoPath}/contributors`,
      );
      setRepos(response.data);

      const contributorsCount = response.data.length;
      setTotalContributors(contributorsCount);

      form.setValue("totalContributors", contributorsCount);

      toast.success("Fetched contributors successfully!");
    } catch (error) {
      console.error("Error fetching repos:", error);
      toast.error("Failed to fetch contributors");
    }
  };

  const form = useForm<RewardContributorFormType>({
    resolver: zodResolver(rewardContributorSchema),
    defaultValues: {
      airdropCampaignName: "",
      githubRepo: "",
      totalContributors: 0,
      tokenMintAddress: "",
    },
  });

  async function onSubmit(values: RewardContributorFormType) {
    try {
      if (!connected || !publicKey) {
        return;
      }
      let promise: any;
      promise = new Promise<void>(async (resolve, reject) => {
        await makeEscrow({
          deposit: values.totalAllocatedAmount,
          mintA: values.tokenMintAddress,
        }).then(async (res) => {
          if (!res) {
            reject("Error depositing funds.");
            return;
          }
          await createAirdropCampaignAction(
            values,
            repos,
            values.totalAllocatedAmount / values.totalContributors,
            res,
          )
            .then(() => {
              resolve();
              router.push("/reward-contributors");
            })
            .catch((error) => {
              reject(error);
            });
        });
      });

      toast.promise(promise, {
        loading: "Creating airdrop campaign...",
        success: "Airdrop campaign created successfully.",
        error: "Failed to create airdrop campaign.",
      });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 p-4"
      >
        <FormField
          control={form.control}
          name="airdropCampaignName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium text-black">
                Campaign Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Eg. Gifting 1000 Tokens to 1000 Contributors of Solana Repo"
                  {...field}
                  className="w-full rounded-md text-black transition-all"
                />
              </FormControl>
              <FormDescription>
                The title of the airdrop campaign
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center space-x-4">
          <FormField
            control={form.control}
            name="githubRepo"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Github Repo</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your GitHub repository"
                    {...field}
                    className="w-full rounded-md text-black transition-all"
                  />
                </FormControl>
                <FormDescription>
                  Enter the repository from which to fetch contributors.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className=""
            type="button"
            onClick={() => fetchRepos(form.getValues("githubRepo"))}
          >
            Check
          </Button>
        </div>

        <FormField
          control={form.control}
          name="totalContributors"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Total Contributors</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={totalContributors !== null ? totalContributors : ""}
                  placeholder="Select a repository to fetch contributors"
                  disabled
                  readOnly
                  className="w-full rounded-md text-black transition-all"
                />
              </FormControl>
              <FormDescription>
                Total contributors for the selected repository
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between space-x-4">
          <FormField
            control={form.control}
            name="tokenMintAddress"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="dark:text-white">Token Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg. 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
                    {...field}
                    className="w-full rounded-md text-black transition-all"
                  />
                </FormControl>
                <FormDescription>
                  Token Address of the Reward (Make sure your wallet has this
                  token)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="totalAllocatedAmount"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="dark:text-white">Reward Amount</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg. 10000"
                    {...field}
                    className="w-full rounded-md text-black transition-all"
                  />
                </FormControl>
                <FormDescription>Reward Amount for the Bounty</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          className="z-10 w-[150px] space-x-3 self-end px-7 py-6 text-sm"
          type="submit"
        >
          <span>Create</span>
          <MoveRight size={20} />
        </Button>
      </form>
    </Form>
  );
};

export default CreateAirdropCampaignForm;
