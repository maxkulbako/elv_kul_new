import { requireClientAuth } from "@/lib/auth/require-client";

const ClientDashboardPage = async () => {
  await requireClientAuth();

  return <div>ClientDashboardPage</div>;
};

export default ClientDashboardPage;
