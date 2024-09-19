"use client";

import { useForm } from "react-hook-form";
import { ProductSchema } from "@/types/product-schema";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { IndianRupee } from "lucide-react";
import Tiptap from "./tip-tap";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { createProduct } from "@/server/actions/create-product";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProductForm() {
  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
  });

  const router = useRouter();

  const { execute, status } = useAction(createProduct, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success(data.success);
        router.push("/dashboard/products");
      }

      if (data?.error) {
        toast.error(data.error);
      }
    },

    onExecute: () => {
      toast.loading("Creating product...");
    },
  });

  const onSubmit = (values: z.infer<typeof ProductSchema>) => {
    execute(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a product</CardTitle>
        <CardDescription>Add a new product to your store</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Camlin Highlighter" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Tiptap val={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <IndianRupee
                        size={36}
                        className="p-2 bg-muted rounded-l-md"
                      />
                      <Input
                        {...field}
                        type="number"
                        placeholder="Your price in rupees"
                        step="5"
                        className="rounded-l-none"
                        min={100}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={status === "executing"} type="submit">
              Create
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
