"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { useResumeStore } from "@/stores/resumeStore";
import TemplateSelector from "@/components/templates/TemplateSelector";
import { createClient as supabaseBrowserClient } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { ResumeContent } from "@/types";
import type { Tables } from "@/types/supabase_atsmaster";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase_atsmaster";

const TemplateSelectionPage = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const {
    templates,
    isLoadingTemplates,
    error: templatesError,
    fetchTemplates,
    createResume,
  } = useResumeStore();
  const [isCreating, setIsCreating] = useState(false);

  // 템플릿 목록 로드
  useEffect(() => {
    if (!isLoadingTemplates && templates.length === 0) {
      fetchTemplates(supabaseBrowserClient() as unknown as SupabaseClient<Database, "atsmaster">);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 템플릿 선택 핸들러
  const handleTemplateSelection = useCallback(
    async (templateId: string) => {
      if (!user) {
        toast.error("로그인이 필요합니다.");
        return;
      }
      const selectedTemplate = templates.find((t) => t.id === templateId);
      const templateName = selectedTemplate?.name || "템플릿";
      setIsCreating(true);
      try {
        const newResume = await createResume(
          {
            title: `새 이력서 (템플릿: ${templateName})`,
            content: {} as ResumeContent, // MVP: 빈 객체로 시작
            template_id: templateId,
            user_id: user.id,
          },
          supabaseBrowserClient() as unknown as SupabaseClient<Database, "atsmaster">
        );
        if (newResume?.id) {
          router.push(`/editor/${newResume.id}`);
        } else {
          toast.error("이력서 생성에 실패했습니다. 다시 시도해주세요.");
        }
      } catch (err) {
        toast.error("이력서 생성에 실패했습니다. 다시 시도해주세요.");
      } finally {
        setIsCreating(false);
      }
    },
    [user, templates, createResume, router]
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-center">
        시작할 템플릿을 선택하세요
      </h1>
      {/* 에러 메시지 */}
      {!isLoadingTemplates && templatesError ? (
        <div className="flex flex-col items-center justify-center py-8">
          <span className="text-destructive font-medium mb-2">템플릿 목록을 불러오는 데 실패했습니다.</span>
          <span className="text-muted-foreground text-sm">{templatesError}</span>
        </div>
      ) : (
        <TemplateSelector
          templates={templates}
          isLoading={isLoadingTemplates}
          onTemplateSelect={handleTemplateSelection}
        />
      )}
      {/* 이력서 생성 중 오버레이 */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="flex flex-col items-center gap-2 bg-background rounded-lg px-6 py-4 shadow-lg border">
            <Loader2 className="animate-spin w-6 h-6 text-primary mb-1" />
            <span className="text-sm font-medium">이력서 생성 중...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelectionPage; 