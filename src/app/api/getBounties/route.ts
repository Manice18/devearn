import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      // Fetch a single product by ID
      const product = await prisma.bounty.findUnique({
        where: {
          id,
        },
      });

      if (!product) {
        return NextResponse.json(
          { error: "Bounty not found!" },
          { status: 404 },
        );
      }

      return NextResponse.json(product);
    } else {
      // Fetch all products
      const products = await prisma.bounty.findMany();
      return NextResponse.json(products);
    }
  } catch (error) {
    console.error("Error fetching bounties", error);
    return NextResponse.json(
      { error: "Failed to fetch bounties" },
      { status: 500 },
    );
  }
}
