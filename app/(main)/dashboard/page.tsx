"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/stores/userStore";
import { useResumeStore } from "@/stores/resumeStore";
import ResumeList from "@/components/dashboard/ResumeList";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PlusCircle, AlertTriangle } from "lucide-react";
import { createClient as supabaseBrowserClient } from "@/lib/supabaseClient";
import type { Database } from "@/types/supabase_atsmaster";
import type { SupabaseClient } from "@supabase/supabase-js";
// import { toast } from "sonner"; // ResumeCard handles toast, so not needed here

const DashboardPage = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const {
    resumes,
    isLoadingResumes,
    error,
    fetchResumes,
    deleteResume,
  } = useResumeStore();

  // 이력서 목록 로드
  useEffect(() => {
    if (user?.id) {
      fetchResumes(
        user.id,
        supabaseBrowserClient() as unknown as SupabaseClient<Database, "atsmaster">
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // 이력서 편집 핸들러
  const handleEditResume = useCallback(
    (resumeId: string) => {
      router.push(`/editor/${resumeId}`);
    },
    [router]
  );

  // 이력서 삭제 핸들러
  const handleDeleteResume = useCallback(
    async (resumeId: string) => {
      await deleteResume(
        resumeId,
        supabaseBrowserClient() as unknown as SupabaseClient<Database, "atsmaster">
      );
      // 별도 toast 불필요 (ResumeCard에서 처리)
    },
    [deleteResume]
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-semibold">내 이력서</h2>
        <Link href="/templates">
          <Button variant="default">
            <PlusCircle className="mr-2 h-5 w-5" /> 새 이력서 만들기
          </Button>
        </Link>
      </div>

      {/* 에러 메시지 */}
      {!isLoadingResumes && error ? (
        <Alert variant="destructive" className="flex items-start">
          <AlertTriangle className="h-4 w-4 mt-0.5 mr-2" />
          <div>
            <AlertTitle>오류</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </div>
        </Alert>
      ) : null}

      {/* 이력서 목록 */}
      <ResumeList
        resumes={resumes}
        isLoading={isLoadingResumes}
        onEditResume={handleEditResume}
        onDeleteResume={handleDeleteResume}
      />
    </div>
  );
};

export default DashboardPage; 