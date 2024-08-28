import Link from "next/link";

import { Spotlight } from "@/components/Common/Spotlight";
import { Button } from "@/components/ui/button";
import { constructMetaData } from "@/lib/metadata";

export const metadata = constructMetaData({
  title: "404 | DevEarn",
  description: "This is the 404 Page for DevEarn",
});

const NotFound = () => {
  return (
    <div className="relative flex h-screen w-full overflow-hidden rounded-md bg-white antialiased dark:bg-[#040404] md:items-center md:justify-center">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:29px_34px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]" />
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="white"
      />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col space-y-6 p-4 pt-20 md:pt-0">
        <h1 className="bg-opacity-50 bg-gradient-to-b from-neutral-400 to-neutral-400/20 bg-clip-text text-center text-4xl font-bold text-transparent dark:from-neutral-50 dark:to-neutral-400/5 md:text-7xl">
          404 <br /> Not Found
        </h1>
        <Button
          variant="outline"
          size="lg"
          className="mx-auto rounded-lg text-sm transition-all duration-500 hover:bg-accent-foreground hover:text-white dark:bg-secondary dark:hover:bg-secondary/70 md:text-base"
        >
          <Link href="/" className="mx-auto">
            Go back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
