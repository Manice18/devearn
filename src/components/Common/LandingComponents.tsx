import Image from "next/image";
import Link from "next/link";

import { socials } from "@/lib/constants";

export const LandingHeader = () => {
  return (
    <header className="flex h-20 items-center border-b border-gray-200 bg-white px-4 lg:px-6">
      <div className="container mx-auto flex items-center justify-between">
        <Link className="flex items-center justify-center" href="/">
          <Image
            height={50}
            width={50}
            src="/assets/brand-icons/logo.svg"
            alt="DevEarn Logo"
            className="size-10"
          />
          <span className="ml-2 hidden text-3xl font-bold text-gray-900 md:block">
            DevEarn
          </span>
        </Link>
        <nav className="flex gap-6">
          {["Features", "How It Works"].map((item) => (
            <Link
              key={item}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
              href={`/#${item.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {item}
            </Link>
          ))}
          <Link
            className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            href={`/signin`}
          >
            Sign In
          </Link>
        </nav>
      </div>
    </header>
  );
};

export const LandingFooter = () => {
  return (
    <footer className="w-full border-t border-gray-200 bg-gray-100 py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-between sm:flex-row">
          <p className="text-sm text-gray-600">
            © 2024 DevEarn. All rights reserved.
          </p>
          <div className="flex space-x-4 sm:mt-0">
            {socials.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                target="_blank"
                className="text-gray-600 transition-colors hover:text-gray-900"
              >
                {social.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
