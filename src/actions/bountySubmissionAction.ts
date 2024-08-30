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
