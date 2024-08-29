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
    <section className="overflow-hidden">
      <SettingsPage user={user} />
    </section>
  );
}
