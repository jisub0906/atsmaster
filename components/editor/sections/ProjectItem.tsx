"use client";

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import type { ProjectItem } from '@/types/index';

export interface ProjectItemProps {
  item: ProjectItem;
  index: number;
  onChange: (index: number, field: keyof ProjectItem, value: string | string[]) => void;
  onDelete: (index: number) => void;
  isLastItem?: boolean;
}

export default function ProjectItem({ item, index, onChange, onDelete }: ProjectItemProps) {
  return (
    <div className="flex flex-col gap-2 border-b pb-2 mb-2">
      <div className="flex flex-col md:flex-row gap-2">
        <Input
          className="flex-1"
          placeholder="프로젝트명"
          value={item.project_name || ''}
          onChange={e => onChange(index, 'project_name', e.target.value)}
        />
        <Input
          className="w-40"
          placeholder="역할"
          value={item.role || ''}
          onChange={e => onChange(index, 'role', e.target.value)}
        />
        <Input
          className="w-32"
          placeholder="시작일 (YYYY-MM)"
          value={item.start_date || ''}
          onChange={e => onChange(index, 'start_date', e.target.value)}
        />
        <Input
          className="w-32"
          placeholder="종료일 (YYYY-MM)"
          value={item.end_date || ''}
          onChange={e => onChange(index, 'end_date', e.target.value)}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onDelete(index)}
          aria-label="삭제"
          className="text-destructive"
        >
          <Trash2 size={18} />
        </Button>
      </div>
      <Input
        placeholder="프로젝트 링크 (URL)"
        value={item.project_link || ''}
        onChange={e => onChange(index, 'project_link', e.target.value)}
      />
      <Input
        placeholder="사용 기술 (쉼표로 구분)"
        value={item.technologies_used?.join(', ') || ''}
        onChange={e => onChange(index, 'technologies_used', e.target.value.split(',').map(s => s.trim()))}
      />
      <Textarea
        placeholder="프로젝트 설명"
        value={item.description || ''}
        onChange={e => onChange(index, 'description', e.target.value)}
        rows={2}
      />
      <Textarea
        placeholder="주요 성과"
        value={item.key_achievements || ''}
        onChange={e => onChange(index, 'key_achievements', e.target.value)}
        rows={2}
      />
    </div>
  );
} 