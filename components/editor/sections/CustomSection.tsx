"use client";

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import CustomSectionItem from './CustomSectionItem';
import type { CustomSection, CustomSectionItem as CustomSectionItemType } from '@/types/index';

export interface CustomSectionProps {
  section: CustomSection;
  onChange: (updatedSection: CustomSection) => void;
}

export default function CustomSection({ section, onChange }: CustomSectionProps) {
  const handleAddItem = () => {
    const newItem: CustomSectionItemType = {
      id: uuidv4(),
      item_title: '',
      item_subtitle: '',
      item_start_date: '',
      item_end_date: '',
      item_description: '',
    };
    onChange({ ...section, items: [...(section.items || []), newItem] });
  };

  const handleItemChange = (index: number, field: keyof CustomSectionItemType, value: string) => {
    const updatedItems = (section.items || []).map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange({ ...section, items: updatedItems });
  };

  const handleItemDelete = (index: number) => {
    const updatedItems = (section.items || []).filter((_, i) => i !== index);
    onChange({ ...section, items: updatedItems });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{section.section_title || '사용자 정의 섹션'}</CardTitle>
      </CardHeader>
      <CardContent>
        {(section.items || []).map((item, idx) => (
          <CustomSectionItem
            key={item.id}
            item={item}
            index={idx}
            onChange={handleItemChange}
            onDelete={handleItemDelete}
            isLastItem={idx === (section.items?.length || 0) - 1}
          />
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={handleAddItem}
          className="mt-2 w-full"
        >
          <Plus className="mr-2" size={16} />
          항목 추가
        </Button>
      </CardContent>
    </Card>
  );
} 