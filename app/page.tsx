"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();
  const { user, isLoadingAuth } = useUserStore();

  useEffect(() => {
    if (!isLoadingAuth && user) {
      router.replace("/dashboard");
    }
  }, [user, isLoadingAuth, router]);

  if (isLoadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // 비로그인 상태 UI
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 py-12 bg-background">
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-5xl font-bold text-primary mb-4"
      >
        ATSMaster
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        className="text-xl text-muted-foreground mb-8 max-w-2xl"
      >
        ATS를 통과하는 완벽한 이력서, <span className="font-semibold text-primary">ATSMaster</span>와 함께라면 어렵지 않습니다.<br />
        쉽고 빠르게, 그리고 자신 있게 이력서를 완성하세요.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Link href="/signup">
          <Button variant="default" size="lg" className="w-48">
            지금 시작하기
          </Button>
        </Link>
        <Link href="/login">
          <Button variant="outline" size="lg" className="w-48">
            로그인
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
