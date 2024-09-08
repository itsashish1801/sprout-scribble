"use client";

import AuthCard from "@/components/auth/auth-card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPasswordSchema } from "@/types/new-password-schema";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { emailSignin } from "@/server/actions/email-signin";
import { cn } from "@/lib/utils";
import { useState } from "react";
import FormSuccess from "@/components/auth/form-success";
import FormError from "@/components/auth/form-error";
import { newPassword } from "@/server/actions/new-password";
import { useSearchParams } from "next/navigation";

export default function NewPasswordForm() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const { execute, status, result } = useAction(newPassword, {
    onSuccess({ data }) {
      if (data?.success) setSuccess(data.success);
      if (data?.error) setError(data.error);
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    execute({ password: values.password, token });
  };

  return (
    <AuthCard
      cardTitle="Password Reset"
      cardDescription="Enter your new password"
      backButtonHref="/auth/login"
      backButtonText="Back to"
      backButtonLabel="Login"
      showSocials={false}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormSuccess message={success} />
          <FormError message={error} />

          <Button
            type="submit"
            className={cn(
              "w-full mt-2",
              status === "executing" ? "animate-pulse" : ""
            )}
          >
            Submit
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
