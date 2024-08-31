import YourListings from "@/components/YourListings/YourListings";
import { constructMetaData } from "@/lib/metadata";

export const metadata = constructMetaData({
  title: "Your Listings | DevEarn",
  description: "This is the Your Listings Page for DevEarn",
});

const Listings = () => {
  return (
    <section>
      <div className="mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Your Listings
        </h1>
        <YourListings />
      </div>
    </section>
  );
};

export default Listings;
