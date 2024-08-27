import Image from "next/image";

import { cn } from "@/lib/utils";

const Logo = ({ classname }: { classname?: string }) => {
  return (
    <div className={cn("flex items-center gap-x-2", classname)}>
      <Image
        src="/images/logo/brand-logo-dark.webp"
        alt="logo"
        width={650}
        height={650}
        priority
        className="hidden h-[50px] w-[80px] dark:block sm:h-[60px]"
      />
      <Image
        src="/images/logo/brand-logo-light.webp"
        alt="logo"
        width={650}
        height={650}
        priority
        className="block h-[50px] w-[80px] dark:hidden sm:h-[60px]"
      />
      <p className="hidden text-xl font-semibold text-black hover:cursor-pointer dark:text-white sm:block">
        DevEarn
      </p>
    </div>
  );
};

export default Logo;
