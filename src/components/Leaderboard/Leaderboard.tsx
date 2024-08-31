import DevRankingTable from "./DevRankingTable";

const Leaderboard = () => {
  return (
    <section>
      <div className="mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Leaderboard{" "}
        </h1>
        <DevRankingTable />
      </div>
    </section>
  );
};

export default Leaderboard;
