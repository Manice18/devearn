import {
  AnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { AnchorProvider } from "@coral-xyz/anchor";

export default function useAnchorProvider() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const anchorWallet = wallet as AnchorWallet;

  return new AnchorProvider(connection, anchorWallet, {
    commitment: "confirmed",
  });
}
