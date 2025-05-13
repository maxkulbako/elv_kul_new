import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ActivePackageTab from "./ActivePackageTab";
import AvailablePackagesTab from "./AvailablePackagesTab";
import OrdersTab from "./OrdersTab";
import {
  getAvailablePackages,
  getOrdersByClientId,
} from "@/lib/actions/price.action";
import { auth } from "@/auth";

const UserPackagesPage = async ({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) => {
  const availablePackages = await getAvailablePackages();
  const session = await auth();

  const orders = await getOrdersByClientId(session?.user.id as string);

  return (
    <div className="flex-grow container py-8 mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">My Therapy Packages</h1>
        <p className="text-muted-foreground">
          Manage your therapy sessions and packages
        </p>
      </div>

      <Tabs
        defaultValue={searchParams.orderId ? "orders" : "active"}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="active">Active Package</TabsTrigger>
          <TabsTrigger value="available">Available Packages</TabsTrigger>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <ActivePackageTab />
        </TabsContent>

        <TabsContent value="available">
          <AvailablePackagesTab packages={availablePackages} />
        </TabsContent>

        <TabsContent value="orders">
          <OrdersTab orders={orders} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserPackagesPage;
