import React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";

import {
  ArrowLeft,
  Clock,
  Check,
  X,
  AlertTriangle,
  Receipt,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { getOrderDetailsById } from "@/lib/actions/price.action";
import PayNowButton from "@/components/shared/PayNowButton";
import { Url } from "url";
import { OrderStatus } from "@prisma/client";

const getStatusConfig = (status: string) => {
  switch (status.toLowerCase()) {
    case "succeeded":
      return {
        color: "bg-green-100 text-green-800",
        icon: <Check className="h-4 w-4" />,
        label: "Paid",
      };
    case "pending":
      return {
        color: "bg-amber-100 text-amber-800",
        icon: <Clock className="h-4 w-4" />,
        label: "Awaiting Payment",
      };
    case "failed":
      return {
        color: "bg-red-100 text-red-800",
        icon: <X className="h-4 w-4" />,
        label: "Payment Failed",
      };
    case "refunded":
      return {
        color: "bg-gray-100 text-gray-800",
        icon: <ArrowLeft className="h-4 w-4" />,
        label: "Refunded",
      };
    case "expired":
      return {
        color: "bg-gray-100 text-gray-800",
        icon: <AlertTriangle className="h-4 w-4" />,
        label: "Payment Deadline Expired",
      };
    default:
      return {
        color: "bg-gray-100 text-gray-800",
        icon: null,
        label: status,
      };
  }
};

const OrderDetailPage = async ({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) => {
  const { orderId } = await params;

  // In a real implementation, we would fetch this from an API
  const order = await getOrderDetailsById(orderId || "");
  if (order?.status === OrderStatus.PENDING && order.repayUrl) {
    order.status = OrderStatus.FAILED;
  }

  if (!order) {
    return (
      <div className="container-content">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Order Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The order you are looking for does not exist or might have been
                deleted.
              </p>
              <Link href="/client/packages">
                <Button className="mt-2">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Packages
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);

  const renderActionSection = () => {
    switch (order.status.toLowerCase()) {
      case "pending":
        return (
          <div className="space-y-4">
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertTitle>Payment Required</AlertTitle>
              <AlertDescription>
                {/* TODO: calculate deadline from the order or appointment */}
                Please complete payment before{" "}
                {format(new Date(Date.now()), "MM/dd/yyyy")}
                to secure your booking.
              </AlertDescription>
            </Alert>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* <Button
                className="bg-olive-primary hover:bg-olive-primary/90 flex-1"
                //                onClick={handlePayNow}
              >
                <CircleDollarSign className="mr-2 h-4 w-4" /> */}
              <PayNowButton orderId={order.id} />
              {/* </Button> */}
              <Button
                variant="outline"
                //                onClick={handleCancelOrder}
                className="flex-1"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel Order
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Your payment information is secured using industry-standard
              encryption.
            </p>
          </div>
        );

      case "succeeded":
        return (
          <div className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertTitle>Payment Successful</AlertTitle>
              <AlertDescription>
                Thank you! Your order has been successfully paid.
                {order.type === "PACKAGE"
                  ? " Your package has been activated and is now available for use."
                  : " Your appointment has been confirmed."}
              </AlertDescription>
            </Alert>
            <div className="flex flex-col sm:flex-row gap-3">
              {order.type === "SINGLE_SESSION" && (
                <Link href="/client/appointments">
                  <Button className="bg-olive-primary hover:bg-olive-primary/90 flex-1">
                    Go to My Appointments
                  </Button>
                </Link>
              )}
              <Button
                variant="outline"
                //                onClick={handleDownloadReceipt}
                className="flex-1"
              >
                <Receipt className="mr-2 h-4 w-4" />
                Download Receipt
              </Button>
            </div>
          </div>
        );

      case "failed":
        return (
          <div className="space-y-4">
            <Alert variant="destructive">
              <X className="h-4 w-4" />
              <AlertTitle>Payment Failed</AlertTitle>
              <AlertDescription>
                Unfortunately, there was a problem processing your payment.
                {order.failureReason && ` Reason: ${order.failureReason}`}
              </AlertDescription>
            </Alert>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={(order.repayUrl as unknown as Url) || ""}
                target="_blank"
              >
                <Button
                  className="bg-olive-primary hover:bg-olive-primary/90 flex-1"
                  disabled={!order.repayUrl}
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Try Again
                </Button>{" "}
              </Link>

              <Button
                variant="outline"
                //                    onClick={handleContactSupport}
                className="flex-1"
              >
                Contact Support
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Please check your payment details or try another payment method.
            </p>
          </div>
        );

      case "refunded":
        return (
          <div className="space-y-4">
            <Alert>
              <AlertTitle>Order Refunded</AlertTitle>
              <AlertDescription>
                This order has been refunded on{" "}
                {order.refundAt
                  ? format(order.refundAt, "MM/dd/yyyy")
                  : "unknown date"}
                .{/* TODO: add refund reason from wayforpay api */}
                {/* {order.refundReason && ` Reason: ${order.refundReason}`} */}
              </AlertDescription>
            </Alert>
            <p className="text-sm text-muted-foreground">
              The refund may take 3-5 business days to appear on your card
              statement.
            </p>
          </div>
        );

      case "expired":
        return (
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Payment Period Expired</AlertTitle>
              <AlertDescription>
                {/* TODO: calculate expiration date from the order or appointment or wayforpay api */}
                The payment period for this order has expired on{" "}
                {format(new Date(Date.now()), "MM/dd/yyyy")}.
              </AlertDescription>
            </Alert>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/client/packages">
                <Button className="bg-olive-primary hover:bg-olive-primary/90 flex-1">
                  Create a New Order
                </Button>
              </Link>
              <Button
                variant="outline"
                //                onClick={handleContactSupport}
                className="flex-1"
              >
                Contact Support
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container py-4">
      <div className="flex items-center mb-6">
        <Link href="/client/packages">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold">Order Details</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Order Details */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Order Information</CardTitle>
                <CardDescription>Details about your order</CardDescription>
              </div>
              <Badge
                className={`${statusConfig.color} flex items-center gap-1 px-3 py-1.5`}
              >
                {statusConfig.icon}
                <span>{statusConfig.label}</span>
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Details Table */}
              <Table>
                <TableBody>
                  <TableRow>
                    <TableHead className="font-medium w-1/3">
                      Order ID
                    </TableHead>
                    <TableCell>{order.id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-medium">Created On</TableHead>
                    <TableCell>
                      {format(order.createdAt, "MM/dd/yyyy")}
                    </TableCell>
                  </TableRow>

                  {/* Service/Package Details */}
                  <TableRow>
                    <TableHead className="font-medium">Type</TableHead>
                    <TableCell className="capitalize">
                      {order.type === "PACKAGE"
                        ? "Therapy Package"
                        : "Individual Session"}
                    </TableCell>
                  </TableRow>

                  {order.type === "PACKAGE" ? (
                    <>
                      <TableRow>
                        <TableHead className="font-medium">Package</TableHead>
                        <TableCell>
                          {order.packagePurchase?.packageTemplate.name}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead className="font-medium">Sessions</TableHead>
                        <TableCell>
                          {order.packagePurchase?.packageTemplate.sessionsTotal}{" "}
                          sessions
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead className="font-medium">Validity</TableHead>
                        <TableCell>
                          {order.packagePurchase?.packageTemplate.validDays}
                        </TableCell>
                      </TableRow>
                    </>
                  ) : (
                    <>
                      <TableRow>
                        <TableHead className="font-medium">Service</TableHead>
                        <TableCell>Individual Session</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead className="font-medium">Date</TableHead>
                        <TableCell>
                          {order.appointment?.date &&
                          order.appointment?.date ? (
                            <>
                              {new Date(
                                order.appointment?.date,
                              ).toLocaleDateString()}{" "}
                              at {order.appointment?.date.toLocaleTimeString()}
                            </>
                          ) : (
                            "Not specified"
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead className="font-medium">Duration</TableHead>
                        <TableCell>
                          {order.appointment?.durationMin} minutes
                        </TableCell>
                      </TableRow>
                    </>
                  )}

                  {/* Payment Details */}
                  {order.status === "SUCCEEDED" && (
                    <>
                      <TableRow>
                        <TableHead className="font-medium">
                          Payment Date
                        </TableHead>
                        <TableCell>
                          {order.paidAt
                            ? format(order.paidAt, "MM/dd/yyyy")
                            : "Not paid yet"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead className="font-medium">
                          Transaction ID
                        </TableHead>
                        <TableCell>{order.paymentIntentId}</TableCell>
                      </TableRow>
                      {/* TODO: add payment method from wayforpay api */}
                      {/* {order.paymentMethod && (
                        <TableRow>
                          <TableHead className="font-medium">
                            Payment Method
                          </TableHead>
                          <TableCell>{order.paymentMethod}</TableCell>
                        </TableRow>
                      )} */}
                    </>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Actions</CardTitle>
            </CardHeader>
            <CardContent>{renderActionSection()}</CardContent>
          </Card>
        </div>

        {/* Pricing Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{order.amount.toFixed(2)}</span>
                </div>

                {/* TODO: add discount from wayforpay api */}
                {/* {order.discount && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${order.discount.toFixed(2)}</span>
                  </div>
                )} */}
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-0</span>
                </div>

                <div className="border-t pt-4 flex justify-between font-bold">
                  <span>Total</span>
                  <span>
                    ${order.amount.toFixed(2)} {order.currency}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <div className="flex items-center gap-3 mb-3">
                <Image
                  src="https://i.pravatar.cc/150?img=36"
                  alt="Dr. Jane Smith"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="text-sm">
                  Service provided by <strong>Dr. Jane Smith</strong>
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                For any questions about this order, please contact our support
                team.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
