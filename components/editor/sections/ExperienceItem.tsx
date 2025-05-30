import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Trash2 } from 'lucide-react';
import type { ExperienceItem as ExperienceItemType } from '@/types';

export interface ExperienceItemProps {
  item: ExperienceItemType;
  index: number;
  onChange: (index: number, fieldName: keyof ExperienceItemType, value: string | boolean) => void;
  onDelete: (index: number) => void;
  isLastItem?: boolean;
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({
  item,
  index,
  onChange,
  onDelete,
  isLastItem = false,
}) => {
  return (
    <div className="space-y-3 py-3">
      <div className="flex justify-between items-start">
        <span className="text-sm font-medium text-muted-foreground">경력 #{index + 1}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="경력 항목 삭제"
          onClick={() => onDelete(index)}
          className="text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`company_name_${item.id}`}>회사명</Label>
          <Input
            id={`company_name_${item.id}`}
            value={item.company_name || ''}
            onChange={e => onChange(index, 'company_name', e.target.value)}
            placeholder="예: 구글"
            autoComplete="organization"
          />
        </div>
        <div>
          <Label htmlFor={`position_${item.id}`}>직책/직무</Label>
          <Input
            id={`position_${item.id}`}
            value={item.position || ''}
            onChange={e => onChange(index, 'position', e.target.value)}
            placeholder="예: 소프트웨어 엔지니어"
            autoComplete="job-title"
          />
        </div>
        <div>
          <Label htmlFor={`start_date_${item.id}`}>시작일</Label>
          <Input
            id={`start_date_${item.id}`}
            type="month"
            value={item.start_date || ''}
            onChange={e => onChange(index, 'start_date', e.target.value)}
            placeholder="YYYY-MM"
            autoComplete="on"
          />
        </div>
        <div>
          <Label htmlFor={`end_date_${item.id}`}>종료일</Label>
          <Input
            id={`end_date_${item.id}`}
            type="month"
            value={item.end_date || ''}
            onChange={e => onChange(index, 'end_date', e.target.value)}
            placeholder="YYYY-MM"
            autoComplete="on"
            disabled={!!item.is_current}
          />
        </div>
        <div className="flex items-center space-x-2 md:col-span-2">
          <Checkbox
            id={`is_current_${item.id}`}
            checked={item.is_current || false}
            onCheckedChange={checked => onChange(index, 'is_current', !!checked)}
          />
          <Label htmlFor={`is_current_${item.id}`}>현재 재직 중</Label>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor={`responsibilities_${item.id}`}>주요 업무 및 성과</Label>
          <Textarea
            id={`responsibilities_${item.id}`}
            value={item.responsibilities || ''}
            onChange={e => onChange(index, 'responsibilities', e.target.value)}
            placeholder="수행한 주요 업무와 성과를 구체적으로 작성하세요. (Markdown 지원 예정, 현재는 일반 텍스트)"
            rows={4}
          />
        </div>
      </div>
      {!isLastItem && <Separator className="mt-4" />}
    </div>
  );
};

export default ExperienceItem; 