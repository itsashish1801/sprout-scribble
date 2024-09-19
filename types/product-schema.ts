import { min } from "drizzle-orm";
import { z } from "zod";

export const ProductSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(40, {
    message: "Description must be at least 40 characters",
  }),
  price: z.coerce
    .number({ invalid_type_error: "Invalid price" })
    .min(100, { message: "Price must be at least 100 rupees" }),
});
