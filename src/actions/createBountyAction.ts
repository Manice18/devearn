"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CreateBountyFormType, createBountySchema } from "@/lib/validation";

export async function createBountyAction(values: CreateBountyFormType) {
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
      difficulty: data.difficulty,
      rewardAmount: data.rewardAmount,
      rewardToken: data.rewardToken,
      isLive: data.isLive === "true",
      completed: false,
      userId: userId,
    },
  });
}
