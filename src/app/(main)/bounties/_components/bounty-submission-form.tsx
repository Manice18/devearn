import { useMemo } from "react";
import dynamic from "next/dynamic";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  BountySubmissionFormType,
  bountySubmissionSchema,
} from "@/lib/validation";
import { formats } from "@/lib/constants";
import { bountySubmissionAction } from "@/actions";

import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

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

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [
            { header: "1" },
            { header: "2" },
            { header: [3, 4, 5, 6] },
            { font: [] },
          ],
          [{ size: [] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ["link"],
          ["clean"],
        ],
      },
    }),
    [],
  );

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
                <ReactQuill
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  value={field.value}
                  placeholder="Link to your submission, or a detailed description of your work"
                  onChange={field.onChange}
                  className="dark:bg-black dark:text-white"
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
