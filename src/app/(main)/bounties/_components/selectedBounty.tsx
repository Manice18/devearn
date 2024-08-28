"use client";

import useOrigin from "@/hooks/use-origin";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const SelectedBounty = ({ bountyId }: { bountyId: string }) => {
  const [bounty, setBounty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  //   useEffect(() => {
  //     const fetchBounty = async (id: string) => {
  //       try {
  //         setIsLoading(true);
  //         const response = await fetch(`/api/getBounties?id=${id}`);
  //         const data = await response.json();
  //         setBounty(data);
  //         console.log(data);
  //         setIsLoading(false);
  //       } catch (error) {
  //         console.error("Error fetching bounty", error);
  //       }
  //     };
  //     fetchBounty(bountyId);
  //   }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section>
      <div className="mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          {/* {bounty.title} */}
        </h1>
      </div>
    </section>
  );
};

export default SelectedBounty;
