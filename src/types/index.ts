import type { PropsWithChildren } from "react";

import { PublicKey } from "@solana/web3.js";

export interface ExtraTWClassProps {
  className?: string;
}

export type ComponentProps = PropsWithChildren<ExtraTWClassProps>;

export type CollectionDetails = {
  mint: PublicKey;
  metadata: PublicKey;
  masterEditionAccount?: PublicKey;
};
