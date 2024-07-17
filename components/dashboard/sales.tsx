import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Order } from "~/lib/infer-type";
import placeholderUser from "~/public/placeholder-user.jpg";

const Sales = ({ totalOrders }: { totalOrders: Order[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New sales</CardTitle>
        <CardDescription>Here are your recent sales</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Image</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {totalOrders.map(({ order, product, quantity, productVariant }) => (
              <TableRow className="font-medium" key={order.id}>
                <TableCell>
                  {order.user.image && order.user.name ? (
                    <div className="flex w-32 items-center gap-2">
                      <Image
                        src={order.user.image}
                        width={25}
                        height={25}
                        alt={order.user.name}
                        className="rounded-full"
                      />
                      <p className="text-xs font-medium">{order.user.name}</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Image
                        src={placeholderUser}
                        width={25}
                        height={25}
                        alt="user not found"
                        className="rounded-full"
                      />
                      <p className="text-xs font-medium">User not found</p>
                    </div>
                  )}
                </TableCell>
                <TableCell>{product.title}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{quantity}</TableCell>
                <TableCell>
                  <Image
                    src={productVariant.variantImages[0].url}
                    width={48}
                    height={48}
                    alt={product.title}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Sales;
