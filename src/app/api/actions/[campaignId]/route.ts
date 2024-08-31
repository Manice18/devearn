import {
  ActionPostResponse,
  createPostResponse,
  MEMO_PROGRAM_ID,
  ActionGetResponse,
  ActionPostRequest,
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

// create the standard headers for this route (including CORS)
const headers = createActionHeaders();

export const GET = async (
  req: Request,
  { params }: { params: { campaignId: string } },
) => {
  if (!params.campaignId) {
    return new Response("Invalid Campaign Id", {
      status: 400,
      headers: headers,
    });
  }
  try {
    const data = await prisma.rewardContributors.findUnique({
      where: {
        id: params.campaignId,
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
            href: `/api/actions/${params.campaignId}`,
            label: "Verify your github username",
            parameters: [
              {
                patternDescription: "Github username here",
                name: "campaignId",
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

export const POST = async (
  req: Request,
  { params }: { params: { campaignId: string } },
) => {
  try {
    const body: ActionPostRequest<{ memo: string }> & {
      params: ActionPostRequest<{ memo: string }>["data"];
    } = await req.json();

    console.log(params.campaignId);
    const userName = body.data!.memo as string;

    const contributors = await prisma.contributors.findMany({
      where: {
        rewardContributorsId: params.campaignId,
        userName: userName,
      },
    });

    if (contributors.length === 0) {
      throw 'Invalid "userName" provided';
    }

    console.log(contributors);
    console.log("body:", body);

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
        data: Buffer.from(`Github username: ${userName} check`),
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

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: "Verify Github Username with Reclaim Protocol",
        links: {
          next: {
            type: "post",
            href: "/api/actions/chaining-basics/next-action",
          },
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
