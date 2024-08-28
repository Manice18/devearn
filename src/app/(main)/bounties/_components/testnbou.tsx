import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { MoveRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { useSession } from "next-auth/react";

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

interface Repo {
  id: number;
  name: string;
  full_name: string;
}

interface Issue {
  id: number;
  title: string;
}

const CreateBountyForm = () => {
  const { publicKey, connected } = useWallet();
  const router = useRouter();
  const session = useSession();

  const [repos, setRepos] = useState<Repo[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);

  const form = useForm<CreateBountyFormType>({
    resolver: zodResolver(createBountySchema),
    defaultValues: {
      title: "",
      oneLiner: "",
      description: "",
      githubRepo: "",
      githubIssue: "",
      difficulty: "EASY",
      rewardAmount: 1,
      rewardToken: "",
      isLive: "false",
    },
  });

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await axios.get<Repo[]>(
          "https://api.github.com/user/repos",
          {
            headers: {
              Authorization: `Bearer ${session.data?.token}`,
            },
          },
        );
        setRepos(response.data);
      } catch (error) {
        console.error("Error fetching repos:", error);
        toast.error("Failed to fetch repositories");
      }
    };

    if (session.data?.token) {
      fetchRepos();
    }
  }, [session.data?.token]);

  const fetchIssues = async (repoFullName: string) => {
    try {
      const response = await axios.get<Issue[]>(
        `https://api.github.com/repos/${repoFullName}/issues`,
        {
          headers: {
            Authorization: `Bearer ${session.data?.token}`,
          },
        },
      );
      setIssues(response.data);
    } catch (error) {
      console.error("Error fetching issues:", error);
      toast.error("Failed to fetch issues");
    }
  };

  const handleRepoChange = (repoFullName: string) => {
    form.setValue("githubRepo", repoFullName);
    form.setValue("githubIssue", ""); // Reset the issue when repo changes
    fetchIssues(repoFullName);
  };

  const onSubmit = async (values: CreateBountyFormType) => {
    if (!publicKey || !connected) {
      toast.error("Please connect your wallet first");
      return;
    }
    try {
      const promise = createBountyAction(values);
      toast.promise(promise, {
        loading: "Creating...",
        success:
          "Bounty created successfully, now taking you to your listings.",
        error: "Error creating bounty. Please try again.",
      });
      await promise;
      router.push("/your-listings");
    } catch (error) {
      console.error("Error creating profile", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 p-4"
      >
        {/* ... (other form fields remain unchanged) ... */}

        <div className="flex space-x-4">
          <FormField
            control={form.control}
            name="githubRepo"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Github Repo</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleRepoChange(value);
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select from one of your repositories" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {repos.map((repo) => (
                      <SelectItem key={repo.id} value={repo.full_name}>
                        {repo.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the repository for your bounty
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="githubIssue"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Github Issue</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!form.watch("githubRepo")}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the issue from your Repository" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {issues.map((issue) => (
                      <SelectItem key={issue.id} value={issue.title}>
                        {issue.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the issue from your Github repository
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ... (rest of the form fields remain unchanged) ... */}

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
