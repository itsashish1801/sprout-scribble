"use server";

import { actionClient } from "@/server/actions/safe-action";
import { ProductSchema } from "@/types/product-schema";
import { db } from "@/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { products } from "@/server/schema";
import { revalidatePath } from "next/cache";

export const deleteProduct = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const deletedProduct = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning();

      revalidatePath("/dashboard/products");

      return { success: `Product deleted: ${deletedProduct[0].title}` };
    } catch (error) {
      return { error: JSON.stringify(error) };
    }
  });
