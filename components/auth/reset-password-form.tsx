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

import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useAction } from "next-safe-action/hooks";

import { cn } from "@/lib/utils";
import { useState } from "react";
import FormSuccess from "@/components/auth/form-success";
import FormError from "@/components/auth/form-error";
import { newPassword } from "@/server/actions/new-password";
import { ResetPasswordSchema } from "@/types/reset-password-schema";
import { resetPassword } from "@/server/actions/reset-password";

export default function ResetPasswordForm() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { execute, status, result } = useAction(resetPassword, {
    onSuccess({ data }) {
      if (data?.success) setSuccess(data.success);
      if (data?.error) setError(data.error);
    },
  });

  const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
    execute(values);
  };

  return (
    <AuthCard
      cardTitle="Forgot Password"
      cardDescription="Enter your email to reset your password"
      backButtonHref="/auth/login"
      backButtonText="Back to"
      backButtonLabel="Login"
      showSocials={false}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="somename@email.com"
                    type="email"
                    autoComplete="email"
                  />
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
            disabled={status === "executing"}
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
