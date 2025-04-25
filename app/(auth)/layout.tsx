export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-olive-light">
      <main>{children}</main>
    </div>
  );
}
