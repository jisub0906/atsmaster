"use client";

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import CoverLetterItem from './CoverLetterItem';
import type { CoverLetterSection } from '@/types/index';

export interface CoverLetterSectionProps {
  data?: CoverLetterSection[];
  onChange: (updatedList: CoverLetterSection[]) => void;
}

export default function CoverLetterSection({ data = [], onChange }: CoverLetterSectionProps) {
  const handleAddItem = () => {
    const newItem: CoverLetterSection = { id: uuidv4(), title: '', content: '' };
    onChange([...data, newItem]);
  };

  const handleItemChange = (index: number, field: keyof CoverLetterSection, value: string) => {
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
        <CardTitle>자기소개서</CardTitle>
      </CardHeader>
      <CardContent>
        {data.map((item, idx) => (
          <CoverLetterItem
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
          자기소개서 추가
        </Button>
      </CardContent>
    </Card>
  );
} 