import YourListings from "@/components/YourListings/YourListings";

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
