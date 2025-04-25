import { Suspense } from "react";
import ClientsTable from "./ClientsTable";
import { ClientsTableSkeleton } from "./ClientsTableSkeleton";

const ClientsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const query = (await searchParams).query;

  return (
    <Suspense fallback={<ClientsTableSkeleton />}>
      <ClientsTable query={query} />
    </Suspense>
  );
};

export default ClientsPage;
