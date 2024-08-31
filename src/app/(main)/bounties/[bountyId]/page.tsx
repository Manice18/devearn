import SelectedBounty from "../_components/selected-bounty";

const Page = async ({ params }: { params: { bountyId: string } }) => {
  return <SelectedBounty bountyId={params.bountyId} />;
};

export default Page;
