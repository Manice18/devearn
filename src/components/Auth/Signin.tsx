"use client";

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { GithubIcon, CheckIcon, ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LandingFooter,
  LandingHeader,
} from "@/components/Common/LandingComponents";
import { providerMap } from "@/lib/auth";

export default function Signup() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <LandingHeader />
      <main className="flex-1 bg-gray-50 py-16">
        <section className="container mx-auto px-4 md:px-6">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl"
          >
            <Card className="overflow-hidden rounded-lg bg-white shadow-xl">
              <CardHeader className="bg-gray-900 py-10 text-center text-white">
                <CardTitle className="mb-4 text-4xl font-bold">
                  On-Chain Rewards for Dev Contributions
                </CardTitle>
                <p className="text-xl text-gray-300">
                  Turn your GitHub contributions into valuable crypto rewards.
                </p>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                <div className="flex items-center justify-center space-x-4">
                  <span className="font-semibold text-gray-600">
                    Powered By
                  </span>
                  <Image
                    src="/assets/icons/solana.svg"
                    width={120}
                    height={120}
                    alt="Solana Logo"
                    className="drop-shadow-md"
                  />
                </div>
                <p className="mx-auto max-w-2xl text-center text-lg text-gray-600">
                  <span className="font-bold text-gray-900">DevEarn</span> is a
                  decentralized platform that transforms your GitHub
                  contributions into on-chain rewards. Set bounties, solve
                  issues, and earn crypto seamlessly, with secured payouts and a
                  reputation system that highlights top developers.
                </p>
                <Button
                  onClick={() =>
                    signIn(Object.values(providerMap)[0].id, {
                      callbackUrl: "/bounties",
                    })
                  }
                  className="flex w-full items-center justify-center rounded-lg bg-gray-900 py-6 text-lg text-white shadow-lg transition-colors duration-300 hover:bg-gray-800"
                >
                  <GithubIcon className="mr-3 h-6 w-6" />
                  Sign up with GitHub
                  <ArrowRightIcon className="ml-3 h-5 w-5" />
                </Button>
                <div className="text-center text-sm text-gray-500">
                  By signing up, you agree to our{" "}
                  <Link href="#" className="text-gray-900 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-gray-900 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </div>
              </CardContent>
            </Card>
            <Card className="mt-10 rounded-lg bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-900">
                  Why join DevEarn?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {[
                    "Earn crypto for your contributions",
                    "Work on exciting open-source projects",
                    "Build your portfolio and on-chain reputation",
                    "Connect with developers worldwide",
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckIcon className="h-6 w-6 flex-shrink-0 text-green-500" />
                      <span className="text-lg text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
