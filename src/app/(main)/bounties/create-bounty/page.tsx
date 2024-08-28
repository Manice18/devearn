import CreateBountyForm from "../_components/createBountyForm";

const Page = () => {
  return (
    <section>
      <div className="mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Create Bounty
        </h1>
        <CreateBountyForm />
      </div>
    </section>
  );
};

export default Page;
