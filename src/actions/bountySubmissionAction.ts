"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  BountySubmissionFormType,
  bountySubmissionSchema,
} from "@/lib/validation";

export async function bountySubmissionAction({
  values,
  bountyId,
}: {
  values: BountySubmissionFormType;
  bountyId: string;
}) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("Unauthorized");

  const data = bountySubmissionSchema.parse(values);

  await prisma.bountySubmission.create({
    data: {
      bountyId: bountyId,
      submissionDetails: data.submissionDetails,
      userId: userId,
    },
  });

  await prisma.devRanking.upsert({
    where: {
      userId: userId,
    },
    update: {
      totalSubmissions: {
        increment: 1,
      },
    },
    create: {
      userId: userId,
      totalSubmissions: 1,
      totalEarnedInUSD: 0,
      totalWins: 0,
    },
  });

  return;
}

export async function getBountySubmissions(bountyId: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("Unauthorized");

  const data = await prisma.bountySubmission.findMany({
    where: {
      bountyId: bountyId,
    },
    include: {
      user: true,
    },
  });

  return data;
}

export async function acceptBountySubmission(
  submissionId: string,
  bountyId: string,
  winAmount: number,
  submissionUserId: string,
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("Unauthorized");

  await prisma.bounty.update({
    where: {
      id: bountyId,
    },
    data: {
      completed: true,
      isLive: false,
    },
  });

  await prisma.bountySubmission.update({
    where: {
      id: submissionId,
    },
    data: {
      isAccepted: true,
    },
  });

  await prisma.devRanking.update({
    where: { userId: submissionUserId },
    data: {
      totalWins: {
        increment: 1,
      },
      totalEarnedInUSD: {
        increment: winAmount,
      },
    },
  });

  return;
}

export async function claimRewardAction(submissionId: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("Unauthorized");

  await prisma.bountySubmission.update({
    where: {
      id: submissionId,
    },
    data: {
      claimedReward: true,
    },
  });

  return;
}
