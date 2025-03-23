import Header from "@/app/components/shared/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto">
      <Header />
      <main>{children}</main>
    </div>
  );
}
