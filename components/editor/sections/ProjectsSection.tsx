"use client";

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import ProjectItemComponent from './ProjectItem';
import type { ProjectItem } from '@/types/index';

export interface ProjectsSectionProps {
  data?: ProjectItem[];
  onChange: (updatedList: ProjectItem[]) => void;
}

export default function ProjectsSection({ data = [], onChange }: ProjectsSectionProps) {
  const handleAddItem = () => {
    const newItem: ProjectItem = {
      id: uuidv4(),
      project_name: '',
      description: '',
      start_date: '',
      end_date: '',
      role: '',
      technologies_used: [],
      project_link: '',
      key_achievements: '',
    };
    onChange([...data, newItem]);
  };

  const handleItemChange = (index: number, field: keyof ProjectItem, value: string | string[]) => {
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
        <CardTitle>프로젝트</CardTitle>
      </CardHeader>
      <CardContent>
        {data.map((item, idx) => (
          <ProjectItemComponent
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
          프로젝트 추가
        </Button>
      </CardContent>
    </Card>
  );
} 