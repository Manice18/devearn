"use client";

import React, { useState, createContext, useContext } from "react";
import Link, { LinkProps } from "next/link";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined,
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "fixed left-0 top-0 z-[99999] hidden h-full border bg-neutral-100 px-4 py-4 dark:bg-neutral-800 md:flex md:flex-col",
          className,
        )}
        animate={{
          width: animate ? (open ? "300px" : "60px") : "300px",
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "z-[9999] ml-auto flex w-20 flex-row items-center justify-between bg-neutral-100 px-4 py-5 dark:bg-neutral-800 md:hidden",
        )}
        {...props}
      >
        <div className="z-[99999] flex w-full justify-end">
          <button
            aria-label="hamburger Toggler"
            className="text-manatee block text-2xl dark:text-white md:hidden"
            onClick={() => setOpen(!open)}
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="absolute right-0 block h-full w-full">
                <span
                  className={`delay-[0] relative left-0 top-0 my-1 block h-0.5 rounded-md bg-black duration-200 ease-in-out dark:bg-white ${
                    !open ? "!w-full delay-300" : "w-0"
                  }`}
                />
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 rounded-md bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                    !open ? "delay-400 !w-full" : "w-0"
                  }`}
                />
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 rounded-md bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                    !open ? "!w-full delay-500" : "w-0"
                  }`}
                />
              </span>
              <span className="du-block absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-md bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                    !open ? "delay-[0] !h-0" : "h-full"
                  }`}
                />
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-md bg-black duration-200 ease-in-out dark:bg-white ${
                    !open ? "!h-0 delay-200" : "h-0.5"
                  }`}
                />
              </span>
            </span>
          </button>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed inset-0 z-[100] flex h-full w-1/2 flex-col justify-between bg-white p-10 dark:bg-neutral-900",
                className,
              )}
            >
              <div
                className="absolute right-10 top-10 z-50 text-neutral-800 hover:cursor-pointer dark:text-neutral-200"
                onClick={() => setOpen(!open)}
              >
                <X />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
  props?: LinkProps;
}) => {
  const { open, animate } = useSidebar();
  return (
    <Link
      href={link.href}
      className={cn(
        "group/sidebar flex items-center justify-start gap-2 py-2",
        className,
      )}
      {...props}
    >
      {link.icon}

      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="!m-0 inline-block whitespace-pre !p-0 text-sm text-neutral-700 transition duration-150 group-hover/sidebar:translate-x-1 dark:text-neutral-200"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};
