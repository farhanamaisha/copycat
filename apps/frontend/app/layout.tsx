import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Copy Cat — Your AI. Your Clone. Your World.",
  description:
    "Copy Cat is a futuristic social platform where every user has an AI Clone that learns their personality over time. Join a Clowder and start training your Clone today.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
  <AuthProvider>
    {children}
  </AuthProvider>
</body>
    </html>
  );
}
