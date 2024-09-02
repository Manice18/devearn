import {
  ActionPostResponse,
  createPostResponse,
  MEMO_PROGRAM_ID,
  ActionGetResponse,
  createActionHeaders,
  ActionError,
} from "@solana/actions";
import {
  clusterApiUrl,
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";

import prisma from "@/lib/prisma";
import { completedAction, generateQR, getNextAction } from "@/lib/blinkHelper";
import { NextRequest } from "next/server";

// create the standard headers for this route (including CORS)
const headers = createActionHeaders();

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const campaignId = searchParams.get("campaignId") as string;
  if (!campaignId) {
    return new Response("Invalid Campaign Id", {
      status: 400,
      headers: headers,
    });
  }
  try {
    const data = await prisma.rewardContributors.findUnique({
      where: {
        id: campaignId,
      },
    });

    const payload: ActionGetResponse = {
      title: data?.airdropCampaignName || "Simple Action Chaining Example",
      icon: new URL("/blink-preview.png", new URL(req.url).origin).toString(),
      description: `Get airdrop for your contributions at ${data?.gitHubRepo}`,
      label: "Get Airdrop",
      links: {
        actions: [
          {
            href: `/api/actions/airdrop?campaignId=${campaignId}`,
            label: "Verify your github username",
            parameters: [
              {
                patternDescription: "Github username here",
                name: "username",
                label: "Put your github username here",
                type: "text",
              },
            ],
          },
        ],
      },
    };

    return Response.json(payload, {
      headers,
    });
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new Response(message, {
      status: 400,
      headers: headers,
    });
  }
};

// DO NOT FORGET TO INCLUDE THE `OPTIONS` HTTP METHOD
// THIS WILL ENSURE CORS WORKS FOR BLINKS
export const OPTIONS = async () => Response.json(null, { headers });

export const POST = async (req: NextRequest) => {
  try {
    const body = (await req.json()) as {
      account: string;
      signature: string;
      data: { username: string };
    };

    const { searchParams } = new URL(req.url);

    const campaignId = searchParams.get("campaignId") as string;
    const getUsername = searchParams.get("username") as string;
    const statusUrl = searchParams.get("statusUrl") as string;
    const claim = searchParams.get("claim") as string;
    let check = searchParams.get("check") as string;

    if (!campaignId) {
      throw "Invalid campaignId provided";
    }

    if (check === null) {
      const contributors = await prisma.contributors.findMany({
        where: {
          rewardContributorsId: campaignId,
          userName: body.data.username,
        },
      });
      if (contributors.length === 0) {
        throw 'Invalid "userName" provided/Not a contributor';
      }
    }

    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      throw 'Invalid "account" provided';
    }
    const transaction = new Transaction().add(
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 1000,
      }),
      new TransactionInstruction({
        programId: new PublicKey(MEMO_PROGRAM_ID),
        data: Buffer.from(`Github username:  check`),
        keys: [],
      }),
    );
    const connection = new Connection(
      process.env.NEXT_PUBLIC_SOLANA_RPC! || clusterApiUrl("devnet"),
    );

    transaction.feePayer = account;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    let imageUrl: string = ``;

    let statusUrlStart: string = "";

    if (check === null) {
      const { requestUrl, statusUrl } = await generateQR();
      imageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${requestUrl}`;
      statusUrlStart = statusUrl;
    }

    if (check === "start") {
      const res = await fetch(statusUrl);
      const data = await res.json();

      if (
        getUsername ===
        JSON.parse(data.session.proofs[0].claimData.parameters).paramValues
          .username
      ) {
        check = "verified";
        if (check !== "verified") {
          throw "Your github username is not verified";
        }
      }
    }

    if (check === "verified" && claim === "true") {
      check = "done";
    }

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: "Verify Github Username with Reclaim Protocol",
        links: {
          next:
            check === null
              ? getNextAction(
                  "1",
                  campaignId,
                  imageUrl,
                  statusUrlStart,
                  body.data.username,
                )
              : check === "verified"
                ? getNextAction(
                    "2",
                    campaignId,
                    `${process.env.NEXT_PUBLIC_ENVIRONMENT === "development" ? "http://localhost:3000/" : "https://devearn.vercel.app/"}blink-preview.png`,
                    null,
                    getUsername,
                  )
                : check === "done"
                  ? completedAction()
                  : completedAction(),
        },
      },
    });

    return Response.json(payload, {
      headers,
    });
  } catch (err) {
    console.log(err);
    let actionError: ActionError = { message: "An unknown error occurred" };
    if (typeof err == "string") actionError.message = err;
    return Response.json(actionError, {
      status: 400,
      headers,
    });
  }
};
