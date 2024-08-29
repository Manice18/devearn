"use client";

import Image from "next/image";

import { motion } from "framer-motion";
import { signIn } from "next-auth/react";

import { providerMap } from "@/lib/auth";

const Signup = () => {
  return (
    <main className="pb-12.5 pt-20 lg:pb-25 xl:pb-30">
      <section className="relative z-1 mx-auto max-w-c-1016 px-7.5 pb-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">
        <motion.div
          variants={{
            hidden: {
              opacity: 0,
              y: -20,
            },

            visible: {
              opacity: 1,
              y: 0,
            },
          }}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 1, delay: 0.1 }}
          viewport={{ once: true }}
          className="animate_top shadow-solid-8 dark:border-strokedark rounded-lg bg-white px-7.5 pt-7.5 dark:border dark:bg-black xl:px-15 xl:pt-15"
        >
          <h2 className="mb-4 text-center text-3xl font-semibold text-black dark:text-white xl:text-[40px]">
            On-Chain Rewards for Dev Contributions
          </h2>
          <p className="mb-10 flex items-center justify-end space-x-3">
            <span>--Powered By</span>
            <Image
              src="/assets/icons/solana.svg"
              width={100}
              height={100}
              alt="solana-logo-dark"
              className=""
            />
          </p>

          <p className="mb-10 text-justify">
            <span className="font-bold">DevEarn</span> is a decentralized
            platform that turns your GitHub contributions into on-chain rewards.
            Set bounties, solve issues, and earn tokens seamlessly, with
            automated payouts and a reputation system that highlights top
            developers.
          </p>

          <div className="flex items-center gap-8">
            <button
              onClick={() =>
                signIn(Object.values(providerMap)[0].id, {
                  callbackUrl: "/bounties",
                })
              }
              aria-label="signup with github"
              className="text-body-color dark:text-body-color-dark dark:shadow-two border-stroke mb-6 flex w-full items-center justify-center rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base outline-none transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-transparent dark:bg-[#2C303B] dark:hover:border-primary dark:hover:bg-primary/5 dark:hover:text-primary dark:hover:shadow-none"
            >
              <span className="mr-3">
                <svg
                  fill="currentColor"
                  width="22"
                  height="22"
                  viewBox="0 0 64 64"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M32 1.7998C15 1.7998 1 15.5998 1 32.7998C1 46.3998 9.9 57.9998 22.3 62.1998C23.9 62.4998 24.4 61.4998 24.4 60.7998C24.4 60.0998 24.4 58.0998 24.3 55.3998C15.7 57.3998 13.9 51.1998 13.9 51.1998C12.5 47.6998 10.4 46.6998 10.4 46.6998C7.6 44.6998 10.5 44.6998 10.5 44.6998C13.6 44.7998 15.3 47.8998 15.3 47.8998C18 52.6998 22.6 51.2998 24.3 50.3998C24.6 48.3998 25.4 46.9998 26.3 46.1998C19.5 45.4998 12.2 42.7998 12.2 30.9998C12.2 27.5998 13.5 24.8998 15.4 22.7998C15.1 22.0998 14 18.8998 15.7 14.5998C15.7 14.5998 18.4 13.7998 24.3 17.7998C26.8 17.0998 29.4 16.6998 32.1 16.6998C34.8 16.6998 37.5 16.9998 39.9 17.7998C45.8 13.8998 48.4 14.5998 48.4 14.5998C50.1 18.7998 49.1 22.0998 48.7 22.7998C50.7 24.8998 51.9 27.6998 51.9 30.9998C51.9 42.7998 44.6 45.4998 37.8 46.1998C38.9 47.1998 39.9 49.1998 39.9 51.9998C39.9 56.1998 39.8 59.4998 39.8 60.4998C39.8 61.2998 40.4 62.1998 41.9 61.8998C54.1 57.7998 63 46.2998 63 32.5998C62.9 15.5998 49 1.7998 32 1.7998Z" />
                </svg>
              </span>
              Signup with Github
            </button>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default Signup;
