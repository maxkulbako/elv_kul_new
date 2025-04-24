import PackageForm from "@/components/shared/PackageFrom";
import { getPackageTemplateById } from "@/lib/actions/price.action";

const EditPackagePage = async ({
  params,
}: {
  params: Promise<{ packageID: string }>;
}) => {
  const { packageID } = await params;
  const packageTemplate = await getPackageTemplateById(packageID);

  if (!packageTemplate) {
    return <div>Package not found</div>;
  }

  return (
    <div className="flex flex-col gap-4 m-8 px-4 max-w-lg mx-auto bg-white rounded-lg">
      <PackageForm initialData={packageTemplate} />
    </div>
  );
};

export default EditPackagePage;
