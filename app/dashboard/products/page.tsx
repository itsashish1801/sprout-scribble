import { db } from "@/server";
import { products } from "@/server/schema";
import placeholderImg from "@/public/placeholder.png";

import { DataTable } from "@/app/dashboard/products/data-table";
import { columns } from "@/app/dashboard/products/columns";
import { Container } from "@/components/ui/container";

export default async function ProductsPage() {
  const products = await db.query.products.findMany({
    orderBy: (products, { desc }) => [desc(products.id)],
  });

  if (!products) throw new Error("No products found");

  const dataTable = products.map((product) => {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      variants: [],
      image: placeholderImg.src,
    };
  });

  if (!dataTable) throw new Error("No data found");

  return (
    <Container className="mt-6 md:mt-8">
      <DataTable data={dataTable} columns={columns} />
    </Container>
  );
}
