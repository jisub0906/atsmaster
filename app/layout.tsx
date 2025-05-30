import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientRoot from "@/components/layout/ClientRoot";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ATSMaster",
  description: "ATS 최적화 이력서 작성 도우미",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${inter.variable} font-sans`}>
      <body>
        <ClientRoot>{children}</ClientRoot>
      </body>
    </html>
  );
}
