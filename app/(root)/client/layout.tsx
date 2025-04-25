export default function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-col bg-olive-light">{children}</div>;
}
