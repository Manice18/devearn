"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import UserButton from "@/components/Common/UserButton";
import { Spinner } from "@/components/Common/Spinner";
import WalletConnectButton from "@/components/Wallet/wallet-connect-button";
import { cn } from "@/lib/utils";

const Header = () => {
  const session = useSession();
  const user = session?.data?.user;

  const menuRef = useRef<HTMLDivElement>(null);
  const pathUrl = usePathname();

  const [navigationMenuOpen, setNavigationMenuOpen] = useState(false);

  const [stickyMenu, setStickyMenu] = useState(false);

  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setNavigationMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 z-[99999] flex w-full items-center border-b border-gray-200 bg-gray-100 px-22 py-3 md:px-4",
        stickyMenu && "border-b-2 bg-white shadow-sm dark:bg-black",
      )}
      ref={menuRef}
    >
      <div className="mx-auto flex w-full max-w-c-1390 items-center">
        <div className="flex w-full items-center justify-end gap-x-2 md:ml-auto">
          {!user && (
            <>
              <Link href="/signin" replace>
                <Button
                  size="default"
                  aria-label="sign up button"
                  className="hover:bg-zumthor dark:hover:bg-btndark rounded-full bg-black px-5 text-base text-white transition-all duration-500 hover:text-black dark:bg-white dark:text-black dark:hover:text-white"
                >
                  {`${
                    pathUrl === "/auth/signup"
                      ? "Sign In"
                      : pathUrl === "/auth/signin"
                        ? "Sign Up"
                        : "Sign Up"
                  }`}
                </Button>
              </Link>
            </>
          )}

          {session.status === "loading" && <Spinner />}
          {user && session.status !== "loading" && (
            <>
              <WalletConnectButton />
              <UserButton user={user} />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
