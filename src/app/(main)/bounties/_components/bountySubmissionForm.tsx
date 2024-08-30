import { Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  BountySubmissionFormType,
  bountySubmissionSchema,
} from "@/lib/validation";
import { toast } from "sonner";
import { bountySubmissionAction } from "@/actions";

const BountySubmissionForm = ({
  bountyId,
  onSubmissionSuccess,
}: {
  bountyId: string;
  onSubmissionSuccess: () => void;
}) => {
  const form = useForm<BountySubmissionFormType>({
    resolver: zodResolver(bountySubmissionSchema),
    defaultValues: {
      submissionDetails: "",
    },
  });

  const onSubmit = async (values: BountySubmissionFormType) => {
    try {
      await bountySubmissionAction({
        values: values,
        bountyId: bountyId,
      });
      toast.success("Bounty submitted successfully");
      onSubmissionSuccess();
    } catch (error) {
      toast.error("Error submitting bounty");
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-4 flex flex-col space-y-4"
      >
        <FormField
          control={form.control}
          name="submissionDetails"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Link to your submission, or a detailed description of your work"
                  {...field}
                  className="dark:hover:bg-hoverdark w-full text-black transition-all duration-500 dark:bg-black dark:text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="z-10 space-x-3 self-end px-7 py-6 text-sm"
          type="submit"
        >
          <span>Post Response</span>
        </Button>
      </form>
    </Form>
  );
};

export default BountySubmissionForm;
