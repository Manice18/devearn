"use client";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { MoveRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWallet } from "@solana/wallet-adapter-react";

import { createBountySchema, CreateBountyFormType } from "@/lib/validation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createBountyAction } from "@/actions";

const CreateBountyForm = () => {
  const { publicKey, connected } = useWallet();
  const router = useRouter();

  const form = useForm<CreateBountyFormType>({
    resolver: zodResolver(createBountySchema),
    defaultValues: {
      title: "",
      oneLiner: "",
      description: "",
      githubRepo: "",
      // tags: [],
      difficulty: "EASY",
      rewardAmount: 1,
      rewardToken: "",
      isLive: "false",
    },
  });

  async function onSubmit(values: CreateBountyFormType) {
    if (!publicKey || !connected) {
      toast.error("Please connect your wallet first");
      return;
    }
    try {
      let promise: any;
      promise = new Promise<void>((resolve, reject) => {
        createBountyAction(values)
          .then(() => {
            resolve();
            router.push("/your-listings");
          })
          .catch((error) => {
            reject(error);
          });
      });

      toast.promise(promise, {
        loading: "Creating...",
        success: "Bounty created successfully, now taking your listings.",
        error: "Error creating bounty. Please try again.",
      });
    } catch (error) {
      console.error("Error creating profile", error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 p-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium text-black">Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Eg. Fix Image Upload"
                  {...field}
                  className="w-full rounded-md text-black transition-all"
                />
              </FormControl>
              <FormDescription>The title of the bounty</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="oneLiner"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium text-black">
                One-liner
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Eg. Fix Image Upload of kyc page"
                  {...field}
                  className="w-full rounded-md text-black transition-all"
                />
              </FormControl>
              <FormDescription>A one-liner about the bounty</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-white">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description "
                  {...field}
                  className="dark:hover:bg-hoverdark w-full text-black transition-all duration-500 dark:bg-black dark:text-white"
                />
              </FormControl>
              <FormDescription>
                Detailed Description of the Bounty
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="githubRepo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Github Repo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select from one of your repositories" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* TODO:Add github linking here*/}
                  <SelectItem value="https://github.com">
                    <div className="flex items-center space-x-2">
                      https://github.com
                    </div>
                  </SelectItem>
                  <SelectItem value="https://github2.com">
                    <div className="flex items-center space-x-2">
                      https://github2.com
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Select the issue from your Github repository
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select from one of your repositories" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="EASY">
                    <div className="flex items-center space-x-2">Easy</div>
                  </SelectItem>
                  <SelectItem value="MEDIUM">
                    <div className="flex items-center space-x-2">Medium</div>
                  </SelectItem>
                  <SelectItem value="HARD">
                    <div className="flex items-center space-x-2">Hard</div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Difficulty of the bounty</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex space-x-4">
          <FormField
            control={form.control}
            name="rewardAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-white">Reward Amount</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg. 1"
                    {...field}
                    className="w-full rounded-md text-black transition-all"
                  />
                </FormControl>
                <FormDescription>Reward Amount for the Bounty</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rewardToken"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Native Payment Token</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a token" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="USDC">
                      <div className="flex items-center space-x-2">
                        <Avatar className="size-7">
                          <AvatarImage src="https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694" />
                          <AvatarFallback>USDC</AvatarFallback>
                        </Avatar>
                        <span>USDC</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="SOL">
                      <div className="flex items-center space-x-2">
                        <Avatar className="size-7">
                          <AvatarImage src="https://assets.coingecko.com/coins/images/4128/standard/solana.png?1718769756" />
                          <AvatarFallback>SOL</AvatarFallback>
                        </Avatar>
                        <span>SOL</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  The native payment token you want to users to pay
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isLive"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-white">Make it Live</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select from one of your repositories" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="true">
                      <div className="flex items-center space-x-2">Yes</div>
                    </SelectItem>
                    <SelectItem value="false">
                      <div className="flex items-center space-x-2">No</div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>Make the bounty live now</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="z-10 w-[150px] space-x-3 self-end px-7 py-6 text-sm"
          type="submit"
        >
          <span>Continue</span>
          <MoveRight size={20} />
        </Button>
      </form>
    </Form>
  );
};

export default CreateBountyForm;
