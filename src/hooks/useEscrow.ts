"use client";

import { useMemo } from "react";

import { AnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { BN, Program } from "@coral-xyz/anchor";
import {
  getAssociatedTokenAddressSync,
  getMint,
  getOrCreateAssociatedTokenAccount,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { toast } from "sonner";
import { randomBytes } from "crypto";

import idl from "@/lib/solana/idl.json";
import { EscrowNew } from "@/types/escrow_new";
import useAnchorProvider from "./useAnchorProvider";

export const useEscrow = () => {
  const wallet = useWallet();
  const anchorProvider = useAnchorProvider();

  const anchorWallet = wallet as AnchorWallet;

  const program = useMemo(() => {
    if (anchorWallet) {
      return new Program<EscrowNew>(idl as EscrowNew, anchorProvider);
    }
  }, [anchorWallet, anchorProvider]);

  const isToken2022 = async (mint: PublicKey) => {
    const mintInfo = await anchorProvider.connection.getAccountInfo(mint);
    return mintInfo?.owner.equals(TOKEN_2022_PROGRAM_ID);
  };

  const getMintInfo = async (mint: PublicKey) => {
    const tokenProgram = (await isToken2022(mint))
      ? TOKEN_2022_PROGRAM_ID
      : TOKEN_PROGRAM_ID;

    return getMint(anchorProvider.connection, mint, undefined, tokenProgram);
  };

  const makeEscrow = async ({
    mintA,
    deposit,
  }: {
    mintA: string;
    deposit: number;
  }) => {
    if (!program) {
      throw new Error("Program not initialized");
    }
    if (!wallet.publicKey) {
      toast.error("Wallet not connected");
      return;
    }
    try {
      const seed = new BN(randomBytes(8));
      const tokenProgram = (await isToken2022(new PublicKey(mintA)))
        ? TOKEN_2022_PROGRAM_ID
        : TOKEN_PROGRAM_ID;

      const makerAtaA = getAssociatedTokenAddressSync(
        new PublicKey(mintA),
        wallet.publicKey,
        false,
        tokenProgram,
      );
      // const makerAtaA = (
      //   await getOrCreateAssociatedTokenAccount(
      //     anchorProvider.connection,
      //     anchorWallet.publicKey,
      //     mintA,
      //     maker.publicKey
      //   )
      // ).address;
      const [escrow] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("escrow"),
          wallet.publicKey.toBuffer(),
          seed.toArrayLike(Buffer, "le", 8),
        ],
        program.programId,
      );

      const vault = getAssociatedTokenAddressSync(
        new PublicKey(mintA),
        escrow,
        true,
        tokenProgram,
      );

      const mintAInfo = await getMintInfo(new PublicKey(mintA));
      const mintAAmount = new BN(deposit).mul(
        new BN(10).pow(new BN(mintAInfo.decimals)),
      );

      return program.methods
        .make(seed, mintAAmount)
        .accountsPartial({
          maker: wallet.publicKey,
          mintA: new PublicKey(mintA),
          makerAtaA: makerAtaA,
          vault: vault,
          escrow: escrow,
        })
        .rpc();
    } catch (e) {
      toast.error("Error creating escrow");
      console.error(e);
    }
  };

  const refundEscrow = async (escrow: PublicKey) => {
    if (!program) {
      throw new Error("Program not initialized");
    }

    try {
      const escrowAccount = await getEscrowInfo(escrow);

      const tokenProgram = (await isToken2022(escrowAccount.mintA))
        ? TOKEN_2022_PROGRAM_ID
        : TOKEN_PROGRAM_ID;

      const makerAtaA = getAssociatedTokenAddressSync(
        new PublicKey(escrowAccount.mintA),
        escrowAccount.maker,
        false,
        tokenProgram,
      );

      const vault = getAssociatedTokenAddressSync(
        new PublicKey(escrowAccount.mintA),
        escrow,
        true,
        tokenProgram,
      );

      return program.methods
        .refund()
        .accountsPartial({
          maker: escrowAccount.maker,
          mintA: new PublicKey(escrowAccount.mintA),
          vault,
          makerAtaA,
          escrow,
          tokenProgram,
        })
        .rpc();
    } catch (e) {
      console.error(e);
    }
  };

  const takerEscrow = async (escrow: PublicKey, amount: number) => {
    if (!program) {
      throw new Error("Program not initialized");
    }
    if (!wallet.publicKey) {
      toast.error("Wallet not connected");
      return;
    }

    try {
      const escrowAccount = await getEscrowInfo(escrow);
      const mintAInfo = await getMintInfo(new PublicKey(escrowAccount.mintA));

      const takerAmount = new BN(amount).mul(
        new BN(10).pow(new BN(mintAInfo.decimals)),
      );
      const tokenProgram = (await isToken2022(escrowAccount.mintA))
        ? TOKEN_2022_PROGRAM_ID
        : TOKEN_PROGRAM_ID;

      const vault = getAssociatedTokenAddressSync(
        new PublicKey(escrowAccount.mintA),
        escrow,
        true,
        tokenProgram,
      );

      const takerAtaA = getAssociatedTokenAddressSync(
        new PublicKey(escrowAccount.mintA),
        wallet.publicKey,
        false,
        tokenProgram,
      );

      return program.methods
        .take(takerAmount)
        .accountsPartial({
          maker: escrowAccount.maker,
          taker: wallet.publicKey,
          mintA: new PublicKey(escrowAccount.mintA),
          escrow,
          vault,
        })
        .rpc();
    } catch (e) {
      toast.error("Error taking escrow");
      console.error(e);
    }
  };

  const getEscrowInfo = async (escrow: PublicKey) => {
    if (!program) {
      throw new Error("Program not initialized");
    }
    return program.account.escrow.fetch(escrow);
  };

  const getAllEscrowAccounts = async () => {
    if (!program) {
      throw new Error("Program not initialized");
    }
    const escrowAccounts = await program.account.escrow.all();

    return escrowAccounts;
  };

  return {
    program,
    makeEscrow,
    refundEscrow,
    getEscrowInfo,
    getAllEscrowAccounts,
    takerEscrow,
  };
};
