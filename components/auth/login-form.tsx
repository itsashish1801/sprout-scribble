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
import { LoginSchema } from "@/types/loginSchema";
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

export default function LoginForm() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { execute, status, result } = useAction(emailSignin, {
    onSuccess({ data }) {
      if (data?.success) setSuccess(data.success);
      if (data?.error) setError(data.error);
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    execute(values);
  };

  return (
    <AuthCard
      cardTitle="Login"
      cardDescription="Enter your email below to login to your account"
      backButtonHref="/auth/register"
      backButtonText="Don't have an account?"
      backButtonLabel="Sign up"
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
                    placeholder="some@email.com"
                    type="email"
                    autoComplete="email"
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormDescription />
                <FormMessage />
                <Link
                  href="/auth/reset"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
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
            Login
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
