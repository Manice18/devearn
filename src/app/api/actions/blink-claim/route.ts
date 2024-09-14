import { NextRequest } from "next/server";

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
import {
  getAssociatedTokenAddressSync,
  getMint,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { BN, Program, web3 } from "@coral-xyz/anchor";

import prisma from "@/lib/prisma";
import {
  completedAction,
  generateQR,
  getNextActionBlink,
} from "@/lib/blinkHelper";
import idl from "@/lib/solana/idl.json";
import { EscrowNew } from "@/types/escrow_new";

const connection = new web3.Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC! || web3.clusterApiUrl("devnet"),
);

const program = new Program<EscrowNew>(idl as EscrowNew, {
  connection,
});

const isToken2022 = async (mint: PublicKey) => {
  const mintInfo = await connection.getAccountInfo(mint);
  return mintInfo?.owner.equals(TOKEN_2022_PROGRAM_ID);
};
const getMintInfo = async (mint: PublicKey) => {
  const tokenProgram = (await isToken2022(mint))
    ? TOKEN_2022_PROGRAM_ID
    : TOKEN_PROGRAM_ID;

  return getMint(connection, mint, undefined, tokenProgram);
};

// create the standard headers for this route (including CORS)
const headers = createActionHeaders();

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const campaignId = searchParams.get("campaignId") as string;

  try {
    const data = await prisma.airdropCampaignBlink.findUnique({
      where: {
        id: campaignId,
      },
    });
    if (!data) {
      return new Response("Invalid Campaign Id", {
        status: 400,
        headers: headers,
      });
    }
    const payload: ActionGetResponse = {
      title: data?.airdropCampaignName || "Airdrop your Contributors",
      icon: new URL("/blink-preview.webp", new URL(req.url).origin).toString(),
      description: `Get airdrop for your contributions at ${data.gitHubRepo}`,
      label: "Get Airdrop",
      links: {
        actions: [
          {
            href: `/api/actions/blink-claim?campaignId=${campaignId}&escrowId=${data.escrowAddress}`,
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
    const { origin } = new URL(req.url);

    const campaignId = searchParams.get("campaignId") as string;
    const escrowId = searchParams.get("escrowId") as string;
    const getUsername = searchParams.get("username") as string;
    const statusUrl = searchParams.get("statusUrl") as string;
    const claim = searchParams.get("claim") as string;
    let check = searchParams.get("check") as string;

    if (!campaignId) {
      throw "Invalid campaignId provided";
    }

    if (check === null) {
      const contributors = await prisma.airdropContributors.findMany({
        where: {
          airdropCampaignBlinkId: campaignId,
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

    if (check === "verified" && claim === "false") {
      const contributors = await prisma.airdropContributors.findMany({
        where: {
          airdropCampaignBlinkId: campaignId,
          userName: getUsername,
        },
      });

      const authority = new web3.PublicKey(body.account);
      const escrow = new web3.PublicKey(escrowId);

      const escrowAccount = await program.account.escrow.fetch(escrow);
      const tokenProgram = (await isToken2022(escrowAccount.mintA))
        ? TOKEN_2022_PROGRAM_ID
        : TOKEN_PROGRAM_ID;

      const mintAInfo = await getMintInfo(new PublicKey(escrowAccount.mintA));
      const takerAmount = new BN(contributors[0].claimAmount).mul(
        new BN(10).pow(new BN(mintAInfo.decimals)),
      );
      const vault = getAssociatedTokenAddressSync(
        new PublicKey(escrowAccount.mintA),
        escrow,
        true,
        tokenProgram,
      );
      const ix = await program.methods
        .take(takerAmount)
        .accountsPartial({
          maker: escrowAccount.maker,
          taker: new PublicKey(body.account),
          mintA: new PublicKey(escrowAccount.mintA),
          escrow,
          vault,
        })
        .instruction();
      const blockhash = await connection
        .getLatestBlockhash({ commitment: "max" })
        .then((res) => res.blockhash);
      const messageV0 = new web3.TransactionMessage({
        payerKey: authority,
        recentBlockhash: blockhash,
        instructions: [ix],
      }).compileToV0Message();
      const transaction = new web3.VersionedTransaction(messageV0);
      const payload: ActionPostResponse = await createPostResponse({
        fields: {
          transaction,
          message: "Verify Github Username with Reclaim Protocol",
          links: {
            next: completedAction(),
          },
        },
      });

      return Response.json(payload, {
        headers,
      });
    }

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: "Verify Github Username with Reclaim Protocol",
        links: {
          next:
            check === null
              ? getNextActionBlink(
                  "1",
                  campaignId,
                  imageUrl,
                  statusUrlStart,
                  escrowId,
                  body.data.username,
                )
              : check === "verified"
                ? getNextActionBlink(
                    "2",
                    campaignId,
                    `${process.env.NEXT_PUBLIC_ENVIRONMENT === "development" ? "http://localhost:3000/" : origin === "https://www.devearn.xyz" || "https://devearn.xyz" ? "https://devearn.xyz/" : "https://devearn.vercel.app/"}blink-preview.webp`,
                    null,
                    escrowId,
                    getUsername,
                  )
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
