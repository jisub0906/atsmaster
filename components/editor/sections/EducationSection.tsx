"use client";

import React from "react";
import type { EducationItem } from "@/types";
import EducationItemComponent from "./EducationItem";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export interface EducationSectionProps {
  data?: EducationItem[] | null;
  onChange: (updatedEducationList: EducationItem[]) => void;
}

const EducationSection: React.FC<EducationSectionProps> = ({ data, onChange }) => {
  // 학력 추가
  const handleAddItem = () => {
    const newItem: EducationItem = {
      id: uuidv4(),
      school_name: "",
      major: "",
      degree: "",
      start_date: "",
      end_date: "",
      gpa: "",
      achievements: "",
    };
    const updated = [...(data ?? []), newItem];
    onChange(updated);
  };

  // 개별 항목 변경
  const handleItemChange = (
    index: number,
    fieldName: keyof EducationItem,
    value: string
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
        <CardTitle>학력</CardTitle>
        <CardDescription>학력 사항을 입력해주세요. (최신순 권장)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data && data.length > 0 ? (
          data.map((item, idx) => (
            <EducationItemComponent
              key={item.id}
              item={item}
              index={idx}
              onChange={handleItemChange}
              onDelete={handleItemDelete}
              isLastItem={idx === (data.length - 1)}
            />
          ))
        ) : (
          <div className="text-muted-foreground text-sm py-4">아직 추가된 학력 정보가 없습니다.</div>
        )}
        <div className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleAddItem}
            className="w-full flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            학력 추가
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EducationSection; 