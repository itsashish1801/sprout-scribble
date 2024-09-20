"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

import { useAction } from "next-safe-action/hooks";
import { deleteProduct } from "@/server/actions/delete-product";
import { toast } from "sonner";
import Link from "next/link";

type ProductColumn = {
  id: number;
  title: string;
  price: number;
  variants: string[];
  image: string;
};

const ActionCell = ({ row }: { row: Row<ProductColumn> }) => {
  const product = row.original;

  const { execute, status } = useAction(deleteProduct, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success(data.success);
      }
      if (data?.error) {
        toast.error(data.error);
      }
    },
    onExecute: () => {
      toast.loading("Deleting product...");
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <span className="sr-only">Actions</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="cursor-pointer">
          <Link href={`/dashboard/add-product?id=${product.id}`}>Edit</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => execute({ id: product.id })}
          className="text-red-500 cursor-pointer"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseInt(row.getValue("price"));
      const formattedPrice = price.toLocaleString("en-US", {
        style: "currency",
        currency: "INR",
      });

      return <div>{formattedPrice}</div>;
    },
  },
  {
    accessorKey: "variants",
    header: "Variants",
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const image = row.getValue("image") as string;
      const title = row.getValue("title") as string;

      return (
        <div>
          <Image
            src={image}
            alt={title}
            width={48}
            height={48}
            className="rounded-md"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ActionCell,
  },
];
