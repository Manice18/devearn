import { NextActionLink } from "@solana/actions";
import { Reclaim } from "@reclaimprotocol/js-sdk";

export async function generateQR() {
  const config = {
    reclaimAppId: process.env.RECLAIM_APP_ID,
    reclaimAppSecret: process.env.RECLAIM_APP_SECRET,
  };
  const reclaimClient = new Reclaim.ProofRequest(config.reclaimAppId!);
  const providerIds = ["6d3f6753-7ee6-49ee-a545-62f1b1822ae5"];
  const APP_SECRET = config.reclaimAppSecret!;

  await reclaimClient.buildProofRequest(providerIds[0], false, "V2Linking");
  reclaimClient.setSignature(await reclaimClient.generateSignature(APP_SECRET));

  await reclaimClient.sessionId;
  const { requestUrl, statusUrl } =
    await reclaimClient.createVerificationRequest();

  console.log("Request URL", requestUrl);
  console.log("Status URL", statusUrl);

  return {
    requestUrl: requestUrl,
    statusUrl: statusUrl,
  };
}

export const getNextAction = (
  stage: string,
  campaignId: string,
  url: string,
  statusUrl: string | null,
  escrowId: string,
  username?: string,
): NextActionLink => {
  return {
    type: "inline",
    action: {
      description: `${stage === "1" ? "Scan the QR to proof your username with zk-proof technology with the help of Reclaim Protocol app and after submitting your proof in the app, click on Submit Proof." : stage === "2" ? "Your GitHub username was verified successfully and hence you are eligible to claim the airdrop. Click on claim and get airdrop for your contributions. Thanks for your contributions and keep contributing!" : stage === "3" ? "Your airdrop is claimed." : ""}`,
      icon: `${url}`,
      label: `${stage === "1" ? "Submit Proof" : stage === "2" ? "Claim Airdrop" : stage === "3" ? "Airdrop Claimed" : ""}`,
      title: `${stage === "1" ? "Proof your GitHub username and claim Airdrop" : stage === "2" ? "Claim Airdrop" : stage === "3" ? "Airdrop Claimed" : ""}`,
      type: "action",
      links: {
        actions: [
          {
            label: `${stage === "1" ? "Submit Proof" : stage === "2" ? "Claim Airdrop" : stage === "3" ? "Airdrop Claimed" : ""}`,
            href: `/api/actions/airdrop?campaignId=${campaignId}&escrowId=${escrowId}&username=${username}&check=${Number(stage) === 1 ? `start&statusUrl=${statusUrl}` : Number(stage) === 2 ? `verified&claim=false` : ""}`,
          },
        ],
      },
    },
  };
};

export const getNextActionBlink = (
  stage: string,
  campaignId: string,
  url: string,
  statusUrl: string | null,
  escrowId: string,
  username?: string,
): NextActionLink => {
  return {
    type: "inline",
    action: {
      description: `${stage === "1" ? "Scan the QR to proof your username with zk-proof technology with the help of Reclaim Protocol app and after submitting your proof in the app, click on Submit Proof." : stage === "2" ? "Your GitHub username was verified successfully and hence you are eligible to claim the airdrop. Click on claim and get airdrop for your contributions. Thanks for your contributions and keep contributing!" : stage === "3" ? "Your airdrop is claimed." : ""}`,
      icon: `${url}`,
      label: `${stage === "1" ? "Submit Proof" : stage === "2" ? "Claim Airdrop" : stage === "3" ? "Airdrop Claimed" : ""}`,
      title: `${stage === "1" ? "Proof your GitHub username and claim Airdrop" : stage === "2" ? "Claim Airdrop" : stage === "3" ? "Airdrop Claimed" : ""}`,
      type: "action",
      links: {
        actions: [
          {
            label: `${stage === "1" ? "Submit Proof" : stage === "2" ? "Claim Airdrop" : stage === "3" ? "Airdrop Claimed" : ""}`,
            href: `/api/actions/blink-claim?campaignId=${campaignId}&escrowId=${escrowId}&username=${username}&check=${Number(stage) === 1 ? `start&statusUrl=${statusUrl}` : Number(stage) === 2 ? `verified&claim=false` : ""}`,
          },
        ],
      },
    },
  };
};

export const completedAction = (): NextActionLink => {
  return {
    type: "inline",
    action: {
      description: `Airdrop claimed successfully. Thanks for your contributions and keep contributing!`,
      icon: `${process.env.NEXT_PUBLIC_ENVIRONMENT === "development" ? "http://localhost:3000/" : "https://devearn.vercel.app/"}airdrop.webp`,
      label: `Claim Successfull`,
      title: `Airdrop Claimed Successfully`,
      type: "completed",
    },
  };
};
