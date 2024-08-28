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
    <>
      <Header />
      <WorkingSidebar>
        <main className="mx-auto max-w-c-1390 px-4 pb-20 pt-20 md:px-8 md:pt-35 xl:pb-25 2xl:px-0">
          {children}
        </main>
      </WorkingSidebar>
    </>
  );
};

export default LoggedInLayout;
