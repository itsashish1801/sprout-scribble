CREATE TABLE IF NOT EXISTS "variantImage" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"size" real NOT NULL,
	"name" text NOT NULL,
	"order" integer NOT NULL,
	"variantId" serial NOT NULL
);
--> statement-breakpoint
ALTER TABLE "productVariant" DROP CONSTRAINT "productVariant_variantId_productVariant_id_fk";
--> statement-breakpoint
ALTER TABLE "productVariant" ADD COLUMN "color" text NOT NULL;--> statement-breakpoint
ALTER TABLE "productVariant" ADD COLUMN "productType" text NOT NULL;--> statement-breakpoint
ALTER TABLE "productVariant" ADD COLUMN "updated" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "productVariant" ADD COLUMN "productId" serial NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "variantImage" ADD CONSTRAINT "variantImage_variantId_productVariant_id_fk" FOREIGN KEY ("variantId") REFERENCES "public"."productVariant"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productVariant" ADD CONSTRAINT "productVariant_productId_product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "productVariant" DROP COLUMN IF EXISTS "url";--> statement-breakpoint
ALTER TABLE "productVariant" DROP COLUMN IF EXISTS "size";--> statement-breakpoint
ALTER TABLE "productVariant" DROP COLUMN IF EXISTS "name";--> statement-breakpoint
ALTER TABLE "productVariant" DROP COLUMN IF EXISTS "order";--> statement-breakpoint
ALTER TABLE "productVariant" DROP COLUMN IF EXISTS "variantId";