import { NextRequest } from "next/server";

import axios from "axios";

import {
  createActionHeaders,
  NextActionPostRequest,
  ActionError,
  CompletedAction,
} from "@solana/actions";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

import prisma from "@/lib/prisma";

type Contributors = {
  id: number;
  login: string;
  contributions: number;
};

// create the standard headers for this route (including CORS)
const headers = createActionHeaders();

export const GET = async (req: Request) => {
  return Response.json({ message: "Method not supported" } as ActionError, {
    status: 403,
    headers,
  });
};

export const OPTIONS = async () => Response.json(null, { headers });

export const POST = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);

    const repo = url.searchParams.get("repo") as string;
    const campaignName = url.searchParams.get("campaignName") as string;
    const tokenAddress = url.searchParams.get("tokenAddress") as string;
    const amount = url.searchParams.get("amount") as string;
    const escrowId = url.searchParams.get("escrowId") as string;

    const body: NextActionPostRequest = await req.json();

    let account: PublicKey;
    let blinkLink: string = "";
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      throw 'Invalid "account" provided';
    }

    let signature: string;
    try {
      signature = body.signature;
      if (!signature) throw "Invalid signature";
    } catch (err) {
      throw 'Invalid "signature" provided';
    }

    const connection = new Connection(
      process.env.NEXT_PUBLIC_SOLANA_RPC! || clusterApiUrl("devnet"),
    );

    try {
      let status = await connection.getSignatureStatus(signature);

      if (!status) throw "Unknown signature status";

      // only accept `confirmed` and `finalized` transactions
      if (status.value?.confirmationStatus) {
        if (
          status.value.confirmationStatus != "confirmed" &&
          status.value.confirmationStatus != "finalized"
        ) {
          throw "Unable to confirm the transaction";
        }
      }
      try {
        const repoPath = repo
          .replace("https://github.com/", "")
          .replace(/\/$/, "");

        const response = await axios.get<Contributors[]>(
          `https://api.github.com/repos/${repoPath}/contributors`,
        );
        if (response.status === 404) {
          throw 'Invalid "repo" provided';
        }
        const contributors = response.data;
        const totalContributors = response.data.length;
        const createAirdropCampaign = await prisma.airdropCampaignBlink.create({
          data: {
            airdropCampaignName: campaignName,
            creatorPubKey: body.account.toString(),
            gitHubRepo: repo,
            totalContributors: totalContributors,
            totalAllocatedAmount: Number(amount),
            eachContributorAmount: Number(amount) / Number(totalContributors),
            tokenMintAddress: tokenAddress,
            escrowAddress: escrowId,
          },
        });

        blinkLink = `https://dial.to/?action=solana-action:http://localhost:3000/api/actions/blink-claim?campaignId=${createAirdropCampaign.id}`;

        const contributorPromises = contributors.map((contributor) => {
          return prisma.airdropContributors.create({
            data: {
              airdropCampaignBlinkId: createAirdropCampaign.id,
              totalContributions: contributor.contributions,
              userName: contributor.login,
              claimAmount: Number(amount) / Number(totalContributors),
            },
          });
        });

        await Promise.all(contributorPromises);
      } catch (error) {
        console.error("Error fetching repos:", error);
      }
    } catch (err) {
      if (typeof err == "string") throw err;
      throw "Unable to confirm the provided signature";
    }

    const transaction = await connection.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0,
      commitment: "confirmed",
    });

    const payload: CompletedAction = {
      type: "completed",
      title: "Airdrop Campaign Created Successfully!",
      icon: new URL("/airdrop.webp", new URL(req.url).origin).toString(),
      label: "Campaign Created!",
      description:
        `You have successfully created airdrop campaign for your contributors at ${repo}` +
        `Now share this Blink with your contributors to claim their airdrop: ${blinkLink}`,
    };

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
