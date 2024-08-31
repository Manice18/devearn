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
  blinkLink: string,
  Contributors: Contributors[],
  eachContributorAmount: number,
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("Unauthorized");

  const data = rewardContributorSchema.parse(values);

  const res = await prisma.rewardContributors.create({
    data: {
      userId: userId,
      airdropCampaignName: data.airdropCampaignName,
      blinkLink: blinkLink,
      gitHubRepo: data.githubRepo,
      totalContributors: data.totalContributors,
      tokenMintAddress: data.tokenMintAddress,
      totalAllocatedAmount: data.totalAllocatedAmount,
      eachContributorAmount: eachContributorAmount,
    },
  });

  const contributorPromises = Contributors.map((contributor) => {
    return prisma.contributors.create({
      data: {
        rewardContributorsId: res.id,
        totalContributions: contributor.contributions,
        userName: contributor.login,
      },
    });
  });

  await Promise.all(contributorPromises);

  return;
}
