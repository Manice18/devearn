import { redirect } from "next/navigation";

import SettingsPage from "@/components/Settings/SettingsPage";
import getSession from "@/lib/getSession";
import { constructMetaData } from "@/lib/metadata";

export const metadata = constructMetaData({
  title: "Settings | DevEarn",
  description: "This is the Settings Page for DevEarn",
});

export default async function Settings() {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    redirect("/api/auth/signin?callbackUrl=/settings");
  }

  return (
    <main className="min mx-auto max-w-c-1390 px-4 pb-20 pt-35 sm:min-w-[400px] md:px-8 md:pt-40 xl:pb-25 xl:pt-46 2xl:px-0">
      <SettingsPage user={user} />
    </main>
  );
}
