import { desc } from "drizzle-orm";
import { NextPage } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import db from "~/server";
import { orderProduct } from "~/server/schema";
import { Sales, Earnings } from "~/components/dashboard";

const AnalyticsPage: NextPage = async () => {
  const totalOrders = await db.query.orderProduct.findMany({
    orderBy: [desc(orderProduct.id)],
    limit: 10,
    with: {
      order: { with: { user: true } },
      product: true,
      productVariant: {
        with: {
          variantImages: true,
        },
      },
    },
  });

  if (totalOrders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No orders</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!totalOrders) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Could not load orders</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your analytics</CardTitle>
        <CardDescription>
          Check your sales, new customers and more
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-8 lg:flex-row">
        <Sales totalOrders={totalOrders} />
        <Earnings totalOrders={totalOrders} />
      </CardContent>
    </Card>
  );
};

export default AnalyticsPage;
