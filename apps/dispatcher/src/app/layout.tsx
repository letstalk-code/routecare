import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RouteCare - NEMT Dispatch & Fleet Tracking",
  description: "Real-time fleet tracking, intelligent dispatch, and seamless coordination for medical transportation excellence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
