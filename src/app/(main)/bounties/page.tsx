import { constructMetaData } from "@/lib/metadata";
import BountiesPage from "@/components/Bounties/BountiesPage";

export const metadata = constructMetaData({
  title: "Bounties | DevEarn",
  description: "This is the Bounties Page for DevEarn",
});

const Bounties = async () => {
  return <BountiesPage />;
};

export default Bounties;
