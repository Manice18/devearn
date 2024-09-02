import Link from "next/link";

const SolanaExplorer = ({
  children,
  address,
  className,
}: {
  children: React.ReactNode;
  address: string;
  className?: string;
}) => {
  return (
    <Link
      href={`https://explorer.solana.com/address/${address}?cluster=devnet`}
      target="_blank"
    >
      {children}
    </Link>
  );
};

export default SolanaExplorer;
