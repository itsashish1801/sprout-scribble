import { Container } from "@/components/ui/container";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

import ProductForm from "@/app/dashboard/add-product/product-form";

export default async function AddProduct() {
  const session = await auth();

  if (session?.user.role !== "admin") return redirect("/dashboard/settings");

  return (
    <Container className="mt-6 md:mt-8">
      <ProductForm />
    </Container>
  );
}
