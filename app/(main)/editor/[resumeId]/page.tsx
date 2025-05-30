"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { useResumeStore } from "@/stores/resumeStore";
import ResumeEditor from "@/components/editor/ResumeEditor";
import { createClient as supabaseBrowserClient } from "@/lib/supabaseClient";
import { Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "@/types/supabase_atsmaster";
import type { ResumeContent } from "@/types";

// UUID 유효성 검사 util
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const isValidUUID = (id: string) => UUID_REGEX.test(id);

export default function EditorPage() {
  const { resumeId } = useParams<{ resumeId: string }>();
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const isLoadingAuth = useUserStore((state) => state.isLoadingAuth);
  const {
    currentResume,
    isLoadingCurrentResume,
    error,
    fetchResumeById,
    selectResume,
    clearCurrentResume,
  } = useResumeStore();
  const supabase = supabaseBrowserClient() as unknown as SupabaseClient<Database, "atsmaster">;

  // 이력서 데이터 로딩/초기화
  useEffect(() => {
    if (!resumeId || !user?.id) return;
    if (resumeId === "new") {
      // 템플릿 선택 없이 직접 접근한 경우: /templates로 리디렉션
      if (!currentResume || !currentResume.id || currentResume.user_id !== user.id) {
        router.replace("/templates");
        return;
      }
      // 이미 템플릿에서 생성된 새 이력서라면 그대로 사용
      return;
    }
    // 기존 이력서: UUID 유효성 체크 후 로드
    if (isValidUUID(resumeId)) {
      fetchResumeById(resumeId, supabase);
    } else {
      // 잘못된 ID 접근 시 404
      router.replace("/not-found");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeId, user?.id]);

  // 언마운트 시 상태 정리
  useEffect(() => {
    return () => {
      clearCurrentResume();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 로딩 상태
  if (isLoadingAuth || isLoadingCurrentResume) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Alert variant="destructive" className="flex items-start max-w-md">
          <AlertTriangle className="h-5 w-5 mt-0.5 mr-2" />
          <div>
            <AlertTitle>이력서 불러오기 오류</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </div>
        </Alert>
      </div>
    );
  }

  // 404/권한 없는 접근: 기존 이력서인데 currentResume이 null
  if (resumeId !== "new" && !currentResume && !isLoadingCurrentResume) {
    router.replace("/not-found");
    return null;
  }

  // 새 이력서인데 아직 템플릿 선택/생성 전 (리디렉션 중)
  if (resumeId === "new" && (!currentResume || !currentResume.id)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        새 이력서 준비 중...
      </div>
    );
  }

  // 정상 데이터: ResumeEditor 렌더링
  if (currentResume) {
    return <ResumeEditor initialResumeData={currentResume as Tables<{ schema: "atsmaster" }, "resumes">} />;
  }

  // 예외: 아무 상태도 해당하지 않을 때 (안전망)
  return null;
} 