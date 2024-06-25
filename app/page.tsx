import { desc } from 'drizzle-orm';
import { NextPage } from 'next';
import { Products } from '~/components/products';
import db from '~/server';

const Home: NextPage = async () => {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },
    orderBy: productVariants => [desc(productVariants.id)],
  });
  return <Products variants={data} />;
};

export default Home;
