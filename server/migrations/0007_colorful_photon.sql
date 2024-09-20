CREATE TABLE IF NOT EXISTS "productVariant" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"size" real NOT NULL,
	"name" text NOT NULL,
	"order" integer NOT NULL,
	"variantId" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "variantTag" (
	"id" serial PRIMARY KEY NOT NULL,
	"tag" text NOT NULL,
	"variantId" serial NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productVariant" ADD CONSTRAINT "productVariant_variantId_productVariant_id_fk" FOREIGN KEY ("variantId") REFERENCES "public"."productVariant"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "variantTag" ADD CONSTRAINT "variantTag_variantId_productVariant_id_fk" FOREIGN KEY ("variantId") REFERENCES "public"."productVariant"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
