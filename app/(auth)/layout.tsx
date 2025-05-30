import React from "react";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4">
      <Link href="/" className="mb-8 text-3xl font-bold text-primary select-none">
        ATSMaster
      </Link>
      {children}
    </div>
  );
} 