"use client";

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import type { CustomSectionItem } from '@/types/index';

export interface CustomSectionItemProps {
  item: CustomSectionItem;
  index: number;
  onChange: (index: number, field: keyof CustomSectionItem, value: string) => void;
  onDelete: (index: number) => void;
  isLastItem?: boolean;
}

export default function CustomSectionItem({ item, index, onChange, onDelete }: CustomSectionItemProps) {
  return (
    <div className="flex flex-col gap-2 border-b pb-2 mb-2">
      <div className="flex flex-col md:flex-row gap-2 items-center">
        <Input
          className="flex-1"
          placeholder="항목 제목"
          value={item.item_title || ''}
          onChange={e => onChange(index, 'item_title', e.target.value)}
        />
        <Input
          className="w-40"
          placeholder="부제목"
          value={item.item_subtitle || ''}
          onChange={e => onChange(index, 'item_subtitle', e.target.value)}
        />
        <Input
          className="w-32"
          placeholder="시작일"
          value={item.item_start_date || ''}
          onChange={e => onChange(index, 'item_start_date', e.target.value)}
        />
        <Input
          className="w-32"
          placeholder="종료일"
          value={item.item_end_date || ''}
          onChange={e => onChange(index, 'item_end_date', e.target.value)}
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
        placeholder="항목 설명"
        value={item.item_description || ''}
        onChange={e => onChange(index, 'item_description', e.target.value)}
        rows={2}
      />
    </div>
  );
} 