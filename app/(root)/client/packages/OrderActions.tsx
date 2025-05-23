import React from "react";
import { Button } from "@/components/ui/button";
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
import { Receipt, X, Loader2 } from "lucide-react";
import { type UserOrder } from "@/lib/actions/price.action"; // Переконайся, що шлях правильний
import PayNowButton from "@/components/shared/PayNowButton";

interface OrderActionsProps {
  order: UserOrder;
  isCancelling: boolean;
  isCurrentOrderCancelling: boolean;
  onInitiateCancel: (orderId: string) => void;
  // onRetry: (orderId: string) => void; // TODO: Add retry functionality
}

export const OrderActions: React.FC<OrderActionsProps> = ({
  order,
  isCancelling,
  isCurrentOrderCancelling,
  onInitiateCancel,
  // onRetry,
}) => {
  switch (order.status) {
    case "PENDING":
      return (
        <div className="flex flex-wrap gap-2 justify-end">
          <PayNowButton orderId={order.id} />

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
                  onClick={() => onInitiateCancel(order.id)}
                  disabled={isCurrentOrderCancelling}
                  className="bg-red-600 hover:bg-red-700"
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
        <Button
          size="sm"
          variant="outline"
          disabled={isCancelling}
          // onClick={() => { /* TODO: Логіка перегляду квитанції */ }}
        >
          <Receipt className="mr-1 h-4 w-4" />
          View Receipt
        </Button>
      );

    case "FAILED":
      return (
        <div className="flex flex-wrap gap-2 justify-end">
          {/* TODO: "Retry Payment"*/}
          <Button
            size="sm"
            variant="outline"
            disabled={isCancelling}
            // onClick={() => { /* TODO: Logic for viewing error details */ }}
          >
            View Details {/* Placeholder */}
          </Button>
        </div>
      );

    default:
      return null;
  }
};
