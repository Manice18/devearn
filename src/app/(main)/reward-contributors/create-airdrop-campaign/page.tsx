import CreateAirdropCampaignForm from "../_components/create-airdrop-campaign-form";

const Page = () => {
  return (
    <section>
      <div className="mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Create Airdrop Campaign
        </h1>
        <CreateAirdropCampaignForm />
      </div>
    </section>
  );
};

export default Page;
