export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-linear-to-br from-blue-600 via-blue-500 to-purple-600">
      <main className="w-full h-full">{children}</main>
    </div>
  );
}
