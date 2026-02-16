export default function GameLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="game">{children}</main>;
}
