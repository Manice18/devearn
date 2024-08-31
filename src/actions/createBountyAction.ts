"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CreateBountyFormType, createBountySchema } from "@/lib/validation";

export async function createBountyAction(
  values: CreateBountyFormType,
  pubkey: string,
  escrowAddress: string,
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("Unauthorized");

  const data = createBountySchema.parse(values);

  await prisma.bounty.create({
    data: {
      title: data.title,
      description: data.description,
      oneLiner: data.oneLiner,
      githubRepo: data.githubRepo,
      githubIssue: data.githubIssue,
      difficulty: data.difficulty,
      rewardAmount: data.rewardAmount,
      rewardToken: data.rewardToken,
      pubKey: pubkey,
      escrowAddress: escrowAddress,
      createdBy: session?.user.name,
      isLive: data.isLive === "true",
      completed: false,
      userId: userId,
    },
  });
}
