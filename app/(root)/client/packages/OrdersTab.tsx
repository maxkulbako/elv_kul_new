"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CircleDollarSign,
  Receipt,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { type UserOrder } from "@/lib/actions/price.action";

interface OrdersTabProps {
  orders: UserOrder[];
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "succeeded":
      return "text-green-600";
    case "pending":
      return "text-amber-600";
    case "failed":
      return "text-red-600";
    case "refunded":
      return "text-gray-600";
    default:
      return "text-gray-600";
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "succeeded":
      return <Check className="h-4 w-4" />;
    case "pending":
      return <AlertTriangle className="h-4 w-4" />;
    case "failed":
      return <X className="h-4 w-4" />;
    default:
      return null;
  }
};

const OrderActions = ({
  status,
  onPayNow,
  onCancel,
  onRetry,
}: {
  status: string;
  onPayNow: () => void;
  onCancel: () => void;
  onRetry: () => void;
}) => {
  switch (status.toLowerCase()) {
    case "pending":
      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-olive-primary hover:bg-olive-primary/90"
            onClick={onPayNow}
          >
            <CircleDollarSign className="mr-1" />
            Pay Now
          </Button>
          <Button size="sm" variant="outline" onClick={onCancel}>
            <X className="mr-1" />
            Cancel Order
          </Button>
        </div>
      );
    case "succeeded":
      return (
        <Button size="sm" variant="outline">
          <Receipt className="mr-1" />
          View Receipt
        </Button>
      );
    case "failed":
      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-olive-primary hover:bg-olive-primary/90"
            onClick={onRetry}
          >
            <ArrowRight className="mr-1" />
            Retry Payment
          </Button>
          <Button size="sm" variant="outline" onClick={onCancel}>
            <X className="mr-1" />
            Cancel Order
          </Button>
        </div>
      );
    default:
      return null;
  }
};

const OrdersTab = ({ orders }: OrdersTabProps) => {
  return (
    <>
      {orders.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
            <CardDescription>
              Track your package and session purchases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-olive-light rounded-lg gap-4"
                >
                  <div className="space-y-2">
                    {/* Order Type and Status */}
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">
                        {order.type === "PACKAGE"
                          ? order.details
                          : "Therapy Session"}
                      </span>
                      <span
                        className={`flex items-center gap-1 ${getStatusColor(order.status)}`}
                      >
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </span>
                    </div>
                    {/* Order Details */}
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>
                        Ordered on{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      {order.type === "SINGLE_SESSION" && (
                        <p>
                          at Session on{" "}
                          {new Date(order.details).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">${order.amount}</p>
                    </div>
                    <OrderActions
                      status={order.status}
                      onPayNow={() => console.log(order.id)}
                      onCancel={() => console.log(order.id)}
                      onRetry={() => console.log(order.id)}
                    />
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
