import React from "react";
import { type UserOrder } from "@/lib/actions/price.action";
import { OrderStatus } from "./OrderStatus";
import { OrderActions } from "./OrderActions";
import { cn } from "@/lib/utils/utils";

interface OrderCardProps {
  order: UserOrder;
  isCancelling: boolean;
  isCurrentOrderCancelling: boolean;
  onPayNow: (orderId: string) => void;
  onInitiateCancel: (orderId: string) => void;
  highlight?: boolean;
  // onRetry?: (orderId: string) => void; // TODO: Add retry functionality
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  isCancelling,
  isCurrentOrderCancelling,
  onPayNow,
  onInitiateCancel,
  highlight = false,
  // onRetry,
}) => {
  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getOrderTitle = (order: UserOrder) => {
    if (order.type === "PACKAGE") {
      return order.details;
    }
    if (order.type === "SINGLE_SESSION") {
      return "Therapy Session";
    }
    return "Unknown Order Type";
  };

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-center justify-between p-4 bg-olive-light rounded-lg gap-4",
        highlight && "border-olive-primary bg-olive-light",
      )}
    >
      <div className="space-y-2 flex-grow">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-semibold">{getOrderTitle(order)}</span>
          <OrderStatus status={order.status} />
        </div>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Ordered on {formatDate(order.createdAt)}</p>

          {order.type === "SINGLE_SESSION" && (
            <p>Session date: {formatDate(order.details)}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-6">
        <div className="text-left md:text-right font-semibold whitespace-nowrap">
          ${order.amount}
        </div>

        <div className="flex-shrink-0">
          <OrderActions
            order={order}
            isCancelling={isCancelling}
            isCurrentOrderCancelling={isCurrentOrderCancelling}
            onPayNow={onPayNow}
            onInitiateCancel={onInitiateCancel}
            // onRetry={onRetry}
          />
        </div>
      </div>
    </div>
  );
};
