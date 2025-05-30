"use client";

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import SkillItemComponent from './SkillItem';
import type { SkillItem } from '@/types/index';

export interface SkillsSectionProps {
  data?: SkillItem[];
  onChange: (updatedList: SkillItem[]) => void;
}

export default function SkillsSection({ data = [], onChange }: SkillsSectionProps) {
  const handleAddItem = () => {
    const newItem: SkillItem = { id: uuidv4(), name: '', level: '중', category: '' };
    onChange([...data, newItem]);
  };

  const handleItemChange = (index: number, field: keyof SkillItem, value: string) => {
    const updated = data.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange(updated);
  };

  const handleItemDelete = (index: number) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>기술</CardTitle>
      </CardHeader>
      <CardContent>
        {data.map((item, idx) => (
          <SkillItemComponent
            key={item.id}
            item={item}
            index={idx}
            onChange={handleItemChange}
            onDelete={handleItemDelete}
            isLastItem={idx === data.length - 1}
          />
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={handleAddItem}
          className="mt-2 w-full"
        >
          <Plus className="mr-2" size={16} />
          기술 추가
        </Button>
      </CardContent>
    </Card>
  );
} 