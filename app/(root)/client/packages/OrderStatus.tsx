import React from "react";
import {
  CheckCircle,
  RefreshCw,
  AlertTriangle,
  XCircle,
  X,
} from "lucide-react";
import { type UserOrder } from "@/lib/actions/price.action";

interface OrderStatusProps {
  status: UserOrder["status"];
}

const getStatusStyles = (
  status: UserOrder["status"],
): { color: string; icon: React.ReactNode } => {
  switch (status) {
    case "PENDING":
      return {
        color: "text-yellow-600",
        icon: <RefreshCw className="h-4 w-4 mr-1" />,
      };
    case "SUCCEEDED":
      return {
        color: "text-green-600",
        icon: <CheckCircle className="h-4 w-4 mr-1" />,
      };
    case "FAILED":
      return {
        color: "text-red-600",
        icon: <AlertTriangle className="h-4 w-4 mr-1" />,
      };
    case "REFUNDED":
      return {
        color: "text-gray-600",
        icon: <XCircle className="h-4 w-4 mr-1" />,
      };
    case "CANCELLED":
      return { color: "text-gray-500", icon: <X className="h-4 w-4 mr-1" /> };
    default:
      return { color: "text-gray-700", icon: null };
  }
};

export const OrderStatus: React.FC<OrderStatusProps> = ({ status }) => {
  const { color, icon } = getStatusStyles(status);

  return (
    <span className={`flex items-center gap-1 ${color}`}>
      {icon}
      <span className="capitalize">{status.toLowerCase()}</span>
    </span>
  );
};
