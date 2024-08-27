import { redirect } from "next/navigation";

import getSession from "@/lib/getSession";
import Header from "@/components/Common/Header";
import { WorkingSidebar } from "@/components/Common/WorkingSidebar";

const LoggedInLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    redirect("/api/auth/signin?callbackUrl=/bounties");
  }
  return (
    <div>
      <Header />
      <WorkingSidebar>
        <main className="mx-auto min-w-[500px] max-w-c-1390 px-4 pb-20 pt-35 md:px-8 md:pt-40 xl:pb-25 xl:pt-46 2xl:px-0">
          {children}
        </main>
      </WorkingSidebar>
    </div>
  );
};

export default LoggedInLayout;
