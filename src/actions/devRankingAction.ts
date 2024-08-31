"use server";

import prisma from "@/lib/prisma";

export async function getAllDevRankings() {
  const devRankings = await prisma.devRanking.findMany({
    orderBy: {
      totalWins: "desc",
    },
    include: {
      user: true,
    },
  });

  return devRankings;
}
