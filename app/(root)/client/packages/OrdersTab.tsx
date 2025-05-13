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
import { useState, useTransition, useEffect } from "react";
import { OrderCard } from "./OrderCard";
import { redirectToWayForPay } from "@/lib/utils/payments";
import { getWayForPayPaymentFormParams } from "@/lib/actions/payments/wayforpay";
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPayPending, startPayTransition] = useTransition();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);

  useEffect(() => {
    console.log("orderId", orderId);
    if (orderId) {
      const order = orders.find((o) => o.id === orderId);
      if (order && order.status === "PENDING") {
        // Автоматично запускаємо оплату для цього ордеру
        handlePayNow(orderId);
      }
    }
  }, [orderId, orders]);

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

  const handlePayNow = (orderId: string) => {
    setPayingOrderId(orderId);
    startPayTransition(async () => {
      try {
        const result = await getWayForPayPaymentFormParams(orderId);

        if (result.success && result.params) {
          console.log("Received params:", result.params);

          // call the util for redirecting to the payment page
          redirectToWayForPay(result.params);
        } else {
          toast.error(
            result.message || "Failed to initiate payment. Please try again.",
            {
              richColors: true,
            },
          );
          setPayingOrderId(null);
        }
      } catch (error) {
        console.error("Payment initiation error:", error);
        toast.error("An unexpected error occurred while initiating payment.", {
          richColors: true,
        });
        setPayingOrderId(null);
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
                  onPayNow={handlePayNow}
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
