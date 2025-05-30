"use client";

import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import type { SkillItem } from '@/types/index';

export interface SkillItemProps {
  item: SkillItem;
  index: number;
  onChange: (index: number, field: keyof SkillItem, value: string) => void;
  onDelete: (index: number) => void;
  isLastItem?: boolean;
}

export default function SkillItem({ item, index, onChange, onDelete }: SkillItemProps) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-2 border-b pb-2 mb-2">
      <Input
        className="flex-1"
        placeholder="기술명 (예: TypeScript)"
        value={item.name || ''}
        onChange={e => onChange(index, 'name', e.target.value)}
      />
      <Select
        value={item.level || ''}
        onValueChange={(value: string) => onChange(index, 'level', value)}
      >
        <SelectTrigger className="w-28" />
        <SelectContent>
          <SelectItem value="상">상</SelectItem>
          <SelectItem value="중">중</SelectItem>
          <SelectItem value="하">하</SelectItem>
        </SelectContent>
      </Select>
      <Input
        className="w-32"
        placeholder="카테고리 (예: Frontend)"
        value={item.category || ''}
        onChange={e => onChange(index, 'category', e.target.value)}
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
  );
} 