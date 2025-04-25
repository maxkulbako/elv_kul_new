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
  CircleDollarSign,
  Receipt,
  X,
  XCircle,
  RefreshCw,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type UserOrder,
  cancelPendingOrderAction,
} from "@/lib/actions/price.action";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState, useTransition } from "react";

interface OrdersTabProps {
  orders: UserOrder[];
}

const getStatusColor = (status: UserOrder["status"]) => {
  switch (status.toLowerCase()) {
    case "SUCCEEDED":
      return "olive-primary";
    case "PENDING":
      return "text-yellow-600";
    case "FAILED":
      return "text-red-600";
    case "REFUNDED":
      return "text-olive-primary";
    default:
      return "default";
  }
};

const getStatusIcon = (status: UserOrder["status"]) => {
  switch (status) {
    case "PENDING":
      return <RefreshCw className="h-4 w-4 mr-1 text-yellow-600" />;
    case "SUCCEEDED":
      return <CheckCircle className="h-4 w-4 mr-1 text-green-600" />;
    case "FAILED":
      return <AlertTriangle className="h-4 w-4 mr-1 text-red-600" />;
    case "REFUNDED":
      return <XCircle className="h-4 w-4 mr-1" />;
    case "CANCELLED":
      return <X className="h-4 w-4 mr-1" />;
    default:
      return null;
  }
};

const OrderActions = ({
  order, // Pass the whole order object
  isCancelling, // Is *any* cancel action pending?
  isCurrentOrderCancelling, // Is *this* order being cancelled?
  onPayNow,
  onInitiateCancel, // Function to call when "Yes, Cancel" is clicked
  //onRetry,
}: {
  order: UserOrder;
  isCancelling: boolean;
  isCurrentOrderCancelling: boolean;
  onPayNow: (orderId: string) => void;
  onInitiateCancel: (orderId: string) => void; // Renamed for clarity
  //onRetry: (orderId: string) => void;
}) => {
  switch (order.status) {
    case "PENDING":
      return (
        <div className="flex flex-wrap gap-2 justify-end">
          {" "}
          {/* Use flex-wrap for smaller screens */}
          <Button
            size="sm"
            className="bg-olive-primary hover:bg-olive-primary/90"
            onClick={() => onPayNow(order.id)}
            disabled={isCurrentOrderCancelling} // Disable if this order is being cancelled
          >
            <CircleDollarSign className="mr-1 h-4 w-4" />
            Pay Now
          </Button>
          {/* Add Confirmation Dialog around Cancel Button */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="outline" disabled={isCancelling}>
                {isCurrentOrderCancelling ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <X className="mr-1 h-4 w-4" />
                )}
                Cancel Order
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently cancel
                  your pending order for &quot;{order.details}&quot;.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isCurrentOrderCancelling}>
                  Back
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onInitiateCancel(order.id)} // Call the passed handler
                  disabled={isCurrentOrderCancelling}
                  className="bg-red-600 hover:bg-red-700" // Destructive style
                >
                  {isCurrentOrderCancelling ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Yes, Cancel Order
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    case "SUCCEEDED":
      return (
        <Button size="sm" variant="outline" disabled={isCancelling}>
          <Receipt className="mr-1 h-4 w-4" />
          View Receipt {/* TODO: Add receipt functionality */}
        </Button>
      );
    case "FAILED":
      return (
        <div className="flex flex-wrap gap-2 justify-end">
          {/* <Button
            size="sm"
            className="bg-olive-primary hover:bg-olive-primary/90"
            onClick={() => onRetry(order.id)} // TODO: Add retry logic
            disabled={isCancelling}
          >
            <ArrowRight className="mr-1 h-4 w-4" />
            Retry Payment
          </Button> */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onInitiateCancel(order.id)}
            disabled={isCancelling}
          >
            {/* Maybe don't allow cancelling failed orders directly? Or use a different action? */}
            {/* For now, let's assume cancellation isn't primary for FAILED */}
            {/* <X className="mr-1 h-4 w-4" /> Cancel Order */}
            View Details {/* Placeholder */}
          </Button>
        </div>
      );
    // Add cases for REFUNDED, CANCELLED if needed (usually no actions)
    default:
      return null;
  }
};

const OrdersTab = ({ orders }: OrdersTabProps) => {
  const [isCancelPending, startCancelTransition] = useTransition();
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(
    null,
  );

  const handlePayNow = (orderId: string) => {
    console.log(`Initiate payment for order: ${orderId}`);
  };

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
                  {/* Actions for the order */}
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">${order.amount}</p>
                    </div>
                    <OrderActions
                      order={order}
                      isCancelling={isCancelPending}
                      isCurrentOrderCancelling={
                        isCancelPending && cancellingOrderId === order.id
                      }
                      onPayNow={handlePayNow}
                      onInitiateCancel={handleCancelOrder}
                      //onRetry={() => console.log(order.id)}
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
