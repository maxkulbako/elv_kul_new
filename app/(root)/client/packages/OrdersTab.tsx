import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockOrders = [
  {
    id: 1,
    package: "Basic Package",
    price: 199,
    status: "pending",
    createdAt: "2024-04-24",
  },
];

const OrdersTab = () => {
  return (
    <>
      {mockOrders.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
            <CardDescription>Track your package purchases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-olive-light rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{order.package}</p>
                    <p className="text-sm text-muted-foreground">
                      Ordered on{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${order.price}</p>
                    <p className="text-sm capitalize text-amber-600">
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Receipt className="h-12 w-12 mx-auto text-olive-primary" />
              <p>You don't have any orders yet.</p>
              <Button className="bg-olive-primary hover:bg-olive-primary/90">
                Browse Packages
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default OrdersTab;
