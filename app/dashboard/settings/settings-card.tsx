"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Session } from "next-auth";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { SettingsSchema } from "@/types/settings-schema";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import FormError from "@/components/auth/form-error";
import FormSuccess from "@/components/auth/form-success";
import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { settings } from "@/server/actions/settings";
import { UploadButton } from "@/app/api/uploadthing/upload";

export default function SettingsCard({ session }: { session: Session }) {
  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: session.user?.name || undefined,
      image: session.user?.image || undefined,
      email: session.user?.email || undefined,
      password: undefined,
      newPassword: undefined,
      isTwoFactorEnabled: session.user?.isTwoFactorEnabled || undefined,
    },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);

  const { execute, status } = useAction(settings, {
    onSuccess: ({ data }) => {
      if (data?.success) setSuccess(data.success);
      if (data?.error) setError(data.error);
    },
    onError: () => {
      setError("Something went wrong");
    },
  });

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    execute(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Settings</CardTitle>
        <CardDescription>Update your account settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={status === "executing"}
                      placeholder="Enter your name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <div className="flex">
                    {!form.getValues("image") ? (
                      <div className="font-semibold w-[42px] h-[42px] bg-rose-100 rounded-full inline-flex items-center justify-center text-rose-800 text-sm">
                        {session.user?.name?.charAt(0).toUpperCase()}
                      </div>
                    ) : (
                      <div>
                        {form.getValues("image") && (
                          <Image
                            src={form.getValues("image")!}
                            width={42}
                            height={42}
                            className="rounded-full"
                            alt={form.getValues("name") ?? "User Image"}
                          />
                        )}
                      </div>
                    )}
                    <UploadButton
                      className="scale-75 ut-button:bg-primary/75 hover:ut-button:bg-primary ut-button:transition-all ut-button:duration-500 ut-label:hidden ut-allowed-content:hidden ut-button:ring-primary"
                      endpoint="avatarUploader"
                      content={{
                        button({ ready }) {
                          if (ready) return "Change Avatar";
                          return "Uploading...";
                        },
                      }}
                      onUploadBegin={() => {
                        setAvatarUploading(true);
                        return;
                      }}
                      onUploadError={(error) => {
                        form.setError("image", {
                          type: "validate",
                          message: error.message,
                        });
                        setAvatarUploading(false);
                        return;
                      }}
                      onClientUploadComplete={(res) => {
                        form.setValue("image", res[0].url);
                        setAvatarUploading(false);
                        return;
                      }}
                    />
                  </div>
                  <FormControl>
                    <Input type="hidden" placeholder="User image" {...field} />
                  </FormControl>
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
                    <Input
                      disabled={status === "executing" || session.user.isOAuth}
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={status === "executing" || session.user.isOAuth}
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isTwoFactorEnabled"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two Factor Authentication</FormLabel>
                  <FormDescription>
                    Enable two factor authentication for your account
                  </FormDescription>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={status === "executing" || session.user.isOAuth}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button
              type="submit"
              disabled={status === "executing" || avatarUploading}
            >
              Save
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
