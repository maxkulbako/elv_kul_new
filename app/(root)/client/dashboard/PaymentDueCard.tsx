import { Card, CardContent } from "@/components/ui/card";
import { getOutstandingBalance } from "@/lib/actions/appointment.action";
import { CreditCard } from "lucide-react";

export const PaymentDueCard = async () => {
  const balance = await getOutstandingBalance();

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Payment Due</p>
            <p className="text-2xl font-semibold">${balance.toFixed(2)}</p>
            <p className="text-olive-primary">
              {balance > 0 ? "Pay now" : "All paid"}
            </p>
          </div>
          <CreditCard className="h-10 w-10 text-olive-primary" />
        </div>
      </CardContent>
    </Card>
  );
};
