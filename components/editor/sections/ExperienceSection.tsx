"use client";

import React from "react";
import type { ExperienceItem } from "@/types";
import ExperienceItemComponent from "./ExperienceItem";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export interface ExperienceSectionProps {
  data?: ExperienceItem[] | null;
  onChange: (updatedExperienceList: ExperienceItem[]) => void;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ data, onChange }) => {
  // 경력 추가
  const handleAddItem = () => {
    const newItem: ExperienceItem = {
      id: uuidv4(),
      company_name: "",
      position: "",
      start_date: "",
      end_date: "",
      responsibilities: "",
      is_current: false,
    };
    const updated = [...(data ?? []), newItem];
    onChange(updated);
  };

  // 개별 항목 변경
  const handleItemChange = (
    index: number,
    fieldName: keyof ExperienceItem,
    value: string | boolean
  ) => {
    if (!data) return;
    const updated = data.map((item, i) =>
      i === index ? { ...item, [fieldName]: value } : item
    );
    onChange(updated);
  };

  // 개별 항목 삭제
  const handleItemDelete = (index: number) => {
    if (!data) return;
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>경력</CardTitle>
        <CardDescription>경력 사항을 입력해주세요. (최신순 권장)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data && data.length > 0 ? (
          data.map((item, idx) => (
            <ExperienceItemComponent
              key={item.id}
              item={item}
              index={idx}
              onChange={handleItemChange}
              onDelete={handleItemDelete}
              isLastItem={idx === (data.length - 1)}
            />
          ))
        ) : (
          <div className="text-muted-foreground text-sm py-4">아직 추가된 경력 정보가 없습니다.</div>
        )}
        <div className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleAddItem}
            className="w-full flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            경력 추가
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceSection; 