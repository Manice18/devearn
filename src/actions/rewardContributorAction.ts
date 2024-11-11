"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  RewardContributorFormType,
  rewardContributorSchema,
} from "@/lib/validation";

type Contributors = {
  id: number;
  login: string;
  contributions: number;
};

export async function createAirdropCampaignAction(
  values: RewardContributorFormType,
  Contributors: Contributors[],
  eachContributorAmount: number,
  escrowAddress: string,
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("Unauthorized");

  const data = rewardContributorSchema.parse(values);

  const res = await prisma.rewardContributors.create({
    data: {
      userId: userId,
      airdropCampaignName: data.airdropCampaignName,
      gitHubRepo: data.githubRepo,
      totalContributors: data.totalContributors,
      tokenMintAddress: data.tokenMintAddress,
      totalAllocatedAmount: data.totalAllocatedAmount,
      eachContributorAmount: eachContributorAmount,
      escrowAddress: escrowAddress,
    },
  });

  await prisma.rewardContributors.update({
    where: {
      id: res.id,
    },
    data: {
      blinkLink: `https://dial.to/developer?url=https://devearn.xyz/api/actions/airdrop?campaignId=${res.id}&cluster=devnet`,
    },
  });

  const contributorPromises = Contributors.map((contributor) => {
    return prisma.contributors.create({
      data: {
        rewardContributorsId: res.id,
        totalContributions: contributor.contributions,
        userName: contributor.login,
        claimAmount: eachContributorAmount,
      },
    });
  });

  await Promise.all(contributorPromises);

  return;
}

export async function fetchAllCampaignsAction(userId: string) {
  const session = await auth();

  if (!session?.user) throw new Error("Unauthorized");

  const campaignData = await prisma.rewardContributors.findMany({
    where: {
      userId: userId,
    },
  });

  return campaignData;
}
