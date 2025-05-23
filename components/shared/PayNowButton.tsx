"use client";

import { CircleDollarSign } from "lucide-react";
import { Button } from "../ui/button";
import { useActionState, useEffect } from "react";
import { getWayForPayPaymentFormParams } from "@/lib/actions/payments/wayforpay";
import { redirectToWayForPay } from "@/lib/utils/payments";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const PayNowButton = ({ orderId }: { orderId: string }) => {
  const [state, action, isPending] = useActionState(
    getWayForPayPaymentFormParams,
    null,
  );

  useEffect(() => {
    if (state) {
      if (state?.success && state?.params) {
        toast.success("Payment initiated successfully");
        redirectToWayForPay(state.params);
      } else {
        toast.error("Payment initiation failed");
      }
    }
  }, [state]);

  return (
    <form action={action}>
      <input type="hidden" name="orderId" value={orderId} />
      <Button
        size="sm"
        className="bg-olive-primary hover:bg-olive-primary/90"
        disabled={isPending}
      >
        <CircleDollarSign className="mr-1 h-4 w-4" />
        {isPending ? (
          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
        ) : (
          "Pay Now"
        )}
      </Button>
    </form>
  );
};

export default PayNowButton;
