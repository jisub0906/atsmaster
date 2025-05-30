"use client";

import type { EducationItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Trash2 } from 'lucide-react';
import React from 'react';

export interface EducationItemProps {
  item: EducationItem;
  index: number;
  onChange: (index: number, fieldName: keyof EducationItem, value: string) => void;
  onDelete: (index: number) => void;
  isLastItem?: boolean;
}

const EducationItem: React.FC<EducationItemProps> = ({
  item,
  index,
  onChange,
  onDelete,
  isLastItem = false,
}) => {
  return (
    <div className="relative space-y-3 py-3">
      {/* 삭제 버튼 (우측 상단) */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 text-destructive hover:bg-destructive/10"
        aria-label="학력 항목 삭제"
        onClick={() => onDelete(index)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 학교명 */}
        <div className="flex flex-col gap-1">
          <Label htmlFor={`school_name_${item.id}`}>학교명</Label>
          <Input
            id={`school_name_${item.id}`}
            value={item.school_name || ''}
            onChange={e => onChange(index, 'school_name', e.target.value)}
            placeholder="한국대학교"
            autoComplete="off"
          />
        </div>
        {/* 전공 */}
        <div className="flex flex-col gap-1">
          <Label htmlFor={`major_${item.id}`}>전공</Label>
          <Input
            id={`major_${item.id}`}
            value={item.major || ''}
            onChange={e => onChange(index, 'major', e.target.value)}
            placeholder="컴퓨터공학과"
            autoComplete="off"
          />
        </div>
        {/* 학위 (선택) */}
        <div className="flex flex-col gap-1">
          <Label htmlFor={`degree_${item.id}`}>학위 <span className="text-muted-foreground text-xs">(선택)</span></Label>
          <Input
            id={`degree_${item.id}`}
            value={item.degree || ''}
            onChange={e => onChange(index, 'degree', e.target.value)}
            placeholder="학사 (선택 사항)"
            autoComplete="off"
          />
        </div>
        {/* 학점 (선택) */}
        <div className="flex flex-col gap-1">
          <Label htmlFor={`gpa_${item.id}`}>학점 <span className="text-muted-foreground text-xs">(선택)</span></Label>
          <Input
            id={`gpa_${item.id}`}
            value={item.gpa || ''}
            onChange={e => onChange(index, 'gpa', e.target.value)}
            placeholder="3.8/4.5 (선택 사항)"
            autoComplete="off"
          />
        </div>
        {/* 시작일 */}
        <div className="flex flex-col gap-1">
          <Label htmlFor={`start_date_${item.id}`}>입학일</Label>
          <Input
            id={`start_date_${item.id}`}
            type="month"
            value={item.start_date || ''}
            onChange={e => onChange(index, 'start_date', e.target.value)}
            placeholder="YYYY-MM"
            autoComplete="off"
          />
        </div>
        {/* 종료일 */}
        <div className="flex flex-col gap-1">
          <Label htmlFor={`end_date_${item.id}`}>졸업일 <span className="text-muted-foreground text-xs">(재학 중이면 비워두세요)</span></Label>
          <Input
            id={`end_date_${item.id}`}
            type="month"
            value={item.end_date || ''}
            onChange={e => onChange(index, 'end_date', e.target.value)}
            placeholder="YYYY-MM"
            autoComplete="off"
          />
        </div>
        {/* 주요 성과/활동 (선택) - 2칸 전체 */}
        <div className="md:col-span-2 flex flex-col gap-1">
          <Label htmlFor={`achievements_${item.id}`}>주요 성과/활동 <span className="text-muted-foreground text-xs">(선택)</span></Label>
          <Textarea
            id={`achievements_${item.id}`}
            value={item.achievements || ''}
            onChange={e => onChange(index, 'achievements', e.target.value)}
            placeholder="주요 교과목, 프로젝트, 수상 내역 등 (선택 사항)"
            rows={2}
            autoComplete="off"
          />
        </div>
      </div>
      {/* 구분선 (마지막 항목이 아니면) */}
      {!isLastItem && <Separator className="mt-6" />}
    </div>
  );
};

export default EducationItem; 