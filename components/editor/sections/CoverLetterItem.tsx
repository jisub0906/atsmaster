"use client";

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import type { CoverLetterSection } from '@/types/index';

export interface CoverLetterItemProps {
  item: CoverLetterSection;
  index: number;
  onChange: (index: number, field: keyof CoverLetterSection, value: string) => void;
  onDelete: (index: number) => void;
  isLastItem?: boolean;
}

export default function CoverLetterItem({ item, index, onChange, onDelete }: CoverLetterItemProps) {
  return (
    <div className="flex flex-col gap-2 border-b pb-2 mb-2">
      <div className="flex items-center gap-2">
        <Input
          className="flex-1"
          placeholder="자기소개서 제목"
          value={item.title || ''}
          onChange={e => onChange(index, 'title', e.target.value)}
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
      <Textarea
        placeholder="자기소개서 내용"
        value={item.content || ''}
        onChange={e => onChange(index, 'content', e.target.value)}
        rows={5}
      />
    </div>
  );
} 