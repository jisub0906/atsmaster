import type { Tables } from '@/types/supabase_atsmaster';
import ResumeCard from './ResumeCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FilePlus2 } from 'lucide-react';
import React from 'react';

export interface ResumeListProps {
  resumes: Tables<{ schema: 'atsmaster' }, 'resumes'>[];
  isLoading: boolean;
  onEditResume: (resumeId: string) => void;
  onDeleteResume: (resumeId: string) => Promise<void>;
}

const ResumeList: React.FC<ResumeListProps> = ({ resumes, isLoading, onEditResume, onDeleteResume }) => {
  // 로딩 상태: Skeleton 카드 3개 이상
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 border rounded-lg space-y-2 bg-background">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-end space-x-2 pt-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 빈 상태: 안내 메시지 + 버튼
  if (!isLoading && resumes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <FilePlus2 className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">아직 작성된 이력서가 없습니다.</h3>
        <p className="text-muted-foreground mb-6">새로운 이력서를 작성하고 당신의 커리어를 빛내보세요.</p>
        <Link href="/templates">
          <Button variant="default" size="lg">
            <FilePlus2 className="mr-2 h-5 w-5" /> 새 이력서 만들기
          </Button>
        </Link>
      </div>
    );
  }

  // 이력서 목록
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {resumes.map((resume) => (
        <ResumeCard
          key={resume.id}
          resume={resume}
          onEdit={onEditResume}
          onDelete={onDeleteResume}
        />
      ))}
    </div>
  );
};

export default ResumeList; 