"use client";

import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { updateProfile } from "@/actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UpdateProfileValues, updateProfileSchema } from "@/lib/validation";

interface SettingsPageProps {
  user: User;
}

const reloadSession = () => {
  const event = new Event("visibilitychange");
  document.dispatchEvent(event);
};

export default function SettingsPage({ user }: SettingsPageProps) {
  const session = useSession();

  const form = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: user.name || "" },
  });

  async function onSubmit(data: UpdateProfileValues) {
    try {
      await updateProfile(data);
      // toast({ description: "Profile updated." });
      toast.success("Profile updated successfully.");
      reloadSession();
      session.update();
    } catch (error) {
      toast.error("Username already exists, please try another one.");
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <h1 className="text-3xl font-bold text-black dark:text-white">
        Settings
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-sm space-y-2.5 px-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black dark:text-white">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter a username"
                    {...field}
                    autoComplete="off"
                    className="dark:hover:bg-hoverdark transition-all duration-500 dark:bg-black"
                  />
                </FormControl>
                <FormDescription className="flex flex-col">
                  <span>Your public username.</span>{" "}
                  <span>
                    <span className="font-medium">Note:</span> It is preferred
                    not to change it since this is from github acting as a
                    unique name.
                  </span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
