import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// components
import Nav from "@/components/navigation/nav";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sprout Scribble",
  description:
    "Sprout Scribble is a simple app where you can sell and buy scribbles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(`${inter.className}`, "antialiased")}>
        <Nav />
        {children}
      </body>
    </html>
  );
}
