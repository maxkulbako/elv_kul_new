import PackageForm from "@/components/shared/PackageFrom";
import { getPackageTemplateById } from "@/lib/actions/price.action";
import Modal from "@/components/shared/Modal";

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
    <Modal>
      <PackageForm initialData={packageTemplate} />
    </Modal>
  );
};

export default EditPackagePage;
