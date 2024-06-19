import db from "~/server";
import placholder from "~/public/placeholder_small.jpg";
import DataTable from "~/components/ui/data-table";
import { productColumns } from "~/components/products";

const ProductsTable = async () => {
  const products = await db.query.products.findMany({
    with: {
      variants: {
        with: {
          variantImages: true,
          variantTags: true,
        },
      },
    },
    orderBy: (products, { desc }) => [desc(products.id)],
  });

  if (!products) throw new Error("No products found");

  const dataTable = products.map(product => ({
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    variants: product.variants,
    image: product?.variants[0]?.variantImages[0]?.url ?? placholder.src,
  }));

  if (!dataTable) throw new Error("No data found");

  return (
    <div>
      <DataTable columns={productColumns} data={dataTable} />
    </div>
  );
};

export default ProductsTable;
