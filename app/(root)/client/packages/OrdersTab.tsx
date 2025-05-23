"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type UserOrder,
  cancelPendingOrderAction,
} from "@/lib/actions/price.action";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { OrderCard } from "./OrderCard";
import { useSearchParams } from "next/navigation";

interface OrdersTabProps {
  orders: UserOrder[];
}

const OrdersTab = ({ orders }: OrdersTabProps) => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  console.log("orderId", orderId);
  const [isCancelPending, startCancelTransition] = useTransition();
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(
    null,
  );

  const handleCancelOrder = (orderId: string) => {
    setCancellingOrderId(orderId);

    startCancelTransition(async () => {
      try {
        const result = await cancelPendingOrderAction(orderId);
        if (result.success) {
          toast.success(result.message || "Order cancelled successfully!", {
            richColors: true,
          });
        } else {
          toast.error(result.message || "Failed to cancel order.", {
            richColors: true,
          });
        }
      } catch (error) {
        console.error("Cancellation transition error:", error);
        toast.error("An unexpected error occurred during cancellation.", {
          richColors: true,
        });
      } finally {
        setCancellingOrderId(null);
      }
    });
  };

  return (
    <>
      {orders.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
            <CardDescription>
              {orderId
                ? "Complete your payment for the selected appointment"
                : "Track your package and session purchases"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  isCancelling={isCancelPending}
                  isCurrentOrderCancelling={cancellingOrderId === order.id}
                  onInitiateCancel={handleCancelOrder}
                  highlight={order.id === orderId}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Receipt className="h-12 w-12 mx-auto text-olive-primary" />
              <p>You don&apos;t have any orders yet.</p>
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
