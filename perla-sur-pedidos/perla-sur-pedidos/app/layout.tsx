import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Perla Sur — Pedidos",
  description: "Panel interno de pedidos de Perla Sur",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
