"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function yourListingAction(userId: string) {
  const session = await auth();

  if (!session?.user) throw new Error("Unauthorized");

  const listingsData = await prisma.bounty.findMany({
    where: {
      userId: userId,
    },
  });

  return listingsData;
}
