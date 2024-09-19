"use server";

import { actionClient } from "@/server/actions/safe-action";
import { ProductSchema } from "@/types/product-schema";
import { db } from "@/server";
import { products } from "@/server/schema";
import { eq } from "drizzle-orm";

export const createProduct = actionClient
  .schema(ProductSchema)
  .action(async ({ parsedInput: { id, title, description, price } }) => {
    try {
      if (id) {
        const currentProduct = await db.query.products.findFirst({
          where: eq(products.id, id),
        });

        if (!currentProduct) {
          return { error: "Product not found" };
        }
        const updatedProduct = await db
          .update(products)
          .set({
            title,
            description,
            price,
          })
          .where(eq(products.id, id))
          .returning();

        return { success: `Product updated: ${updatedProduct[0].title}` };
      }

      const newProduct = await db
        .insert(products)
        .values({
          title,
          description,
          price,
        })
        .returning();

      return { success: `Product created: ${newProduct[0].title}` };
    } catch (error) {
      return { error: JSON.stringify(error) };
    }
  });
