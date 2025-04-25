import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { type Client } from "./page";

const BilingTab = ({ client }: { client: Client }) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Billing Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm font-medium">Custom Price</div>
            <div className="flex items-center justify-between">
              <div>
                {client?.pricing[0]?.price
                  ? `$${client.pricing[0].price} per session`
                  : "Default pricing"}
              </div>
              <Button variant="outline" size="sm">
                Adjust Price
              </Button>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium">Payment Method</div>
            <div>Card ending in 4242</div> {/* TODO: add payment method */}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            Payment history will appear here when available
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default BilingTab;
