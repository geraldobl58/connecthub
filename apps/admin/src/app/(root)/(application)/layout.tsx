export default function ApplicationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex items-center justify-center">{children}</div>;
}
