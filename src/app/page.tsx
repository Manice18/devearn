import Link from "next/link";

import { GithubIcon, CoinsIcon, ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LandingFooter,
  LandingHeader,
} from "@/components/Common/LandingComponents";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100 text-gray-900">
      <LandingHeader />
      <main className="flex-1">
        <section className="w-full bg-gray-100 py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <Badge
                className="bg-gray-200 text-sm text-gray-700"
                variant="secondary"
              >
                On-Chain Rewards for Dev Contributions
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl/none">
                Earn Crypto by Solving GitHub Issues
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
                DevEarn is a decentralized platform that converts GitHub
                contributions into on-chain rewards. Set bounties, solve issues,
                and earn crypto with secured payouts and a reputation system for
                top developers.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <span className="font-semibold text-gray-600">
                  -- Powered By
                </span>
                <Image
                  src="/assets/icons/solana.svg"
                  width={120}
                  height={120}
                  alt="Solana Logo"
                  className="drop-shadow-md"
                />
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/signin">
                  <Button className="bg-gray-900 text-white hover:bg-gray-800">
                    Get Started
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-900 hover:bg-gray-100"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section
          className="w-full bg-white py-12 md:py-24 lg:py-32"
          id="features"
        >
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter text-gray-900 sm:text-4xl">
              Key Features
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="border-gray-200 bg-gray-50">
                <CardHeader>
                  <GithubIcon className="mb-4 h-12 w-12 text-gray-700" />
                  <CardTitle className="text-gray-900">
                    GitHub Integration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Seamlessly connect with GitHub repositories and issues.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-gray-200 bg-gray-50">
                <CardHeader>
                  <CoinsIcon className="mb-4 h-12 w-12 text-gray-700" />
                  <CardTitle className="text-gray-900">
                    Solana Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Earn crypto for your contributions to open-source projects.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-gray-200 bg-gray-50">
                <CardHeader>
                  <ArrowRightIcon className="mb-4 h-12 w-12 text-gray-700" />
                  <CardTitle className="text-gray-900">
                    Streamlined Process
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Easy-to-use platform for creating, finding, claiming, and
                    submitting bounties.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section
          className="w-full bg-gray-100 py-12 md:py-24 lg:py-32"
          id="how-it-works"
        >
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <Badge className="mb-4 h-8 w-8 bg-gray-200 text-lg text-gray-700">
                    1
                  </Badge>
                  <CardTitle className="text-gray-900">
                    Browse Bounties
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Explore available bounties from various open-source
                    projects.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <Badge className="mb-4 h-8 w-8 bg-gray-200 text-lg text-gray-700">
                    2
                  </Badge>
                  <CardTitle className="text-gray-900">Claim & Solve</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Claim a bounty and submit link to your pull request.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <Badge className="mb-4 h-8 w-8 bg-gray-200 text-lg text-gray-700">
                    3
                  </Badge>
                  <CardTitle className="text-gray-900">Get Rewarded</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Once accepted, unlock the reward and receive crypto payment.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full bg-white py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter text-gray-900 sm:text-4xl">
                Ready to Start Earning?
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join DevEarn today and turn your coding skills into crypto
                rewards.
              </p>
              <div className="w-full max-w-sm space-y-2">
                <Link href="/signin">
                  <Button className="bg-gray-900 text-white hover:bg-gray-800">
                    Sign Up
                  </Button>
                </Link>
                <p className="text-xs text-gray-500">
                  By signing up, you agree to our{" "}
                  <Link
                    className="underline underline-offset-2 hover:text-gray-900"
                    href="#"
                  >
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
