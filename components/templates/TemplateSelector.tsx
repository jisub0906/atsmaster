import type { Tables } from '@/types/supabase_atsmaster';
import TemplateCard from './TemplateCard';
import { Skeleton } from '@/components/ui/skeleton';
import { ClipboardX } from 'lucide-react';
import React from 'react';

export interface TemplateSelectorProps {
  templates: Tables<{ schema: 'atsmaster' }, 'resume_templates'>[];
  isLoading: boolean;
  onTemplateSelect: (templateId: string) => void;
}

const SKELETON_COUNT = 3;

export default function TemplateSelector({ templates, isLoading, onTemplateSelect }: TemplateSelectorProps) {
  // 로딩 상태
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
            <div className="aspect-video bg-muted" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-5 w-3/5" />
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-3 w-2/5" />
            </div>
            <div className="p-4 pt-0">
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 빈 상태
  if (!isLoading && templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <ClipboardX className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-lg text-muted-foreground">현재 사용 가능한 템플릿이 없습니다.</p>
      </div>
    );
  }

  // 템플릿 목록
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onSelect={onTemplateSelect}
        />
      ))}
    </div>
  );
} 