import { randomBytes } from "crypto";
import { NextRequest } from "next/server";

import { BN, Program, web3 } from "@coral-xyz/anchor";
import {
  ActionPostResponse,
  createPostResponse,
  ActionGetResponse,
  createActionHeaders,
  ActionError,
} from "@solana/actions";
import { PublicKey } from "@solana/web3.js";
import {
  getAssociatedTokenAddressSync,
  getMint,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

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
  try {
    const payload: ActionGetResponse = {
      title: "Create airdrop for your contributors",
      icon: new URL("/blink-preview.webp", new URL(req.url).origin).toString(),
      description: `Reward your hard working contributors for their valuable contributions at any GitHub repository of your choice.`,
      label: "Get Airdrop",
      links: {
        actions: [
          {
            href: `/api/actions/blink-airdrop`,
            label: "Create airdrop",
            parameters: [
              {
                patternDescription: "Airdrop Campaign Name here",
                name: "campaignName",
                label: "Enter Campaign Name here",
                type: "text",
              },
              {
                patternDescription: "Github Repo Link here",
                name: "repo",
                label: "Enter GitHub Repo link here",
                type: "text",
              },
              {
                patternDescription: "Airdrop Allocation here",
                name: "amount",
                label: "Enter the total amount to be allocated for the airdrop",
                type: "number",
              },
              {
                patternDescription: "Token Mint Address here",
                name: "tokenAddress",
                label: "Enter the token mint address for the airdrop",
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
      data: {
        repo: string;
        campaignName: string;
        amount: number;
        tokenAddress: string;
      };
    };

    const authority = new web3.PublicKey(body.account);
    if (!program) {
      throw "Program not initialized";
    }
    if (!body.account) {
      throw "Wallet not connected";
    }

    const seed = new BN(randomBytes(8));
    const tokenProgram = (await isToken2022(
      new PublicKey(body.data.tokenAddress),
    ))
      ? TOKEN_2022_PROGRAM_ID
      : TOKEN_PROGRAM_ID;

    const makerAtaA = getAssociatedTokenAddressSync(
      new PublicKey(body.data.tokenAddress),
      new PublicKey(body.account),
      false,
      tokenProgram,
    );

    const [escrow] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("escrow"),
        new PublicKey(body.account).toBuffer(),
        seed.toArrayLike(Buffer, "le", 8),
      ],
      program.programId,
    );

    const vault = getAssociatedTokenAddressSync(
      new PublicKey(body.data.tokenAddress),
      escrow,
      true,
      tokenProgram,
    );

    const mintAInfo = await getMintInfo(new PublicKey(body.data.tokenAddress));
    const mintAAmount = new BN(body.data.amount).mul(
      new BN(10).pow(new BN(mintAInfo.decimals)),
    );

    const ix = await program.methods
      .make(seed, mintAAmount)
      .accountsPartial({
        maker: new PublicKey(body.account),
        mintA: new PublicKey(body.data.tokenAddress),
        makerAtaA: makerAtaA,
        vault: vault,
        escrow: escrow,
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
        message: `Airdrop campaign created successfully`,
        links: {
          next: {
            type: "post",
            href: `/api/actions/blink-airdrop/next-action?repo=${body.data.repo}&campaignName=${body.data.campaignName}&amount=${body.data.amount}&tokenAddress=${body.data.tokenAddress}&escrowId=${escrow.toString()}`,
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
