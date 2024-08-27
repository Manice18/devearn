export const shortenWalletAddress = (walletAddress: string, len = 5) => {
  return walletAddress.slice(0, len) + "...." + walletAddress.slice(-len);
};
