import db from "~/server";
import placholder from "~/public/placeholder_small.jpg";
import DataTable from "~/components/ui/data-table";
import { productColumns } from "~/components/products";

const ProductsTable = async () => {
  const products = await db.query.products.findMany({
    orderBy: (products, { desc }) => [desc(products.id)],
  });

  if (!products) throw new Error("No products found");

  const dataTable = products.map(product => ({
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    variants: [],
    image: placholder.src,
  }));

  if (!dataTable) throw new Error("No data found");

  return (
    <div>
      <DataTable columns={productColumns} data={dataTable} />
    </div>
  );
};

export default ProductsTable;
