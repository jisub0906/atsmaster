"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, FileDown, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

export interface ResumeEditorToolbarProps {
  resumeTitle?: string;
  onSave: () => Promise<void>;
  onExportPdf?: () => void;
  isSaving: boolean;
  lastSaved?: Date | string | null;
  onTitleChange?: (newTitle: string) => void;
}

const ResumeEditorToolbar: React.FC<ResumeEditorToolbarProps> = ({
  resumeTitle,
  onSave,
  onExportPdf,
  isSaving,
  lastSaved,
  onTitleChange,
}) => {
  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b p-3 flex items-center justify-between mb-6">
      {/* 좌측: 제목 및 마지막 저장 시간 */}
      <div className="flex items-center gap-2 min-w-0">
        {onTitleChange ? (
          <Input
            type="text"
            value={resumeTitle || ""}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="이력서 제목"
            className="text-lg font-semibold border-none focus-visible:ring-0 focus-visible:ring-offset-0 w-auto max-w-xs bg-transparent px-0 min-h-0 h-8"
            aria-label="이력서 제목 입력"
          />
        ) : (
          <h2 className="text-lg font-semibold truncate max-w-xs" title={resumeTitle || "새 이력서"}>
            {resumeTitle || "새 이력서"}
          </h2>
        )}
        {lastSaved && (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            마지막 저장: {formatDistanceToNow(new Date(lastSaved), { addSuffix: true, locale: ko })}
          </span>
        )}
      </div>
      {/* 우측: 액션 버튼 그룹 */}
      <div className="flex items-center space-x-2">
        <Button size="sm" onClick={onSave} disabled={isSaving} type="button">
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isSaving ? "저장 중..." : "저장"}
        </Button>
        {onExportPdf && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExportPdf}
            type="button"
          >
            <FileDown className="mr-2 h-4 w-4" /> PDF 내보내기
          </Button>
        )}
      </div>
    </div>
  );
};

export default ResumeEditorToolbar; 