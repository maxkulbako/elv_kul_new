import Image from "next/image";

const TestsPage = () => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-250px)]">
      <Image
        src="/under_construction.gif"
        alt="Test"
        width={500}
        height={500}
      />
    </div>
  );
};

export default TestsPage;
