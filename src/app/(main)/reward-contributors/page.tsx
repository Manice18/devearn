import { constructMetaData } from "@/lib/metadata";

export const metadata = constructMetaData({
  title: "Reward Contributors | DevEarn",
  description: "This is the Reward Contributors Page for DevEarn",
});

const Page = () => {
  return (
    <section>
      <div className="mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Reward Contributors
          </h1>
        </div>
      </div>
    </section>
  );
};

export default Page;
