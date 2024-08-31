import LeaderboardTable from "@/components/Leaderboard/Leaderboard";
import { constructMetaData } from "@/lib/metadata";

export const metadata = constructMetaData({
  title: "Leaderboard | DevEarn",
  description: "This is the Leaderboard Page for DevEarn",
});

const Leaderboard = () => {
  return (
    <div>
      <LeaderboardTable />
    </div>
  );
};

export default Leaderboard;
