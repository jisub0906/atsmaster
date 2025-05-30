"use client";

import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import type { Tables } from "@/types/supabase_atsmaster";
import * as React from "react";

// Local AspectRatio implementation (16/9 by default)
const AspectRatio: React.FC<{ ratio?: number; className?: string; children: React.ReactNode }> = ({ ratio = 16 / 9, className = "", children }) => (
  <div
    className={`relative w-full ${className}`}
    style={{ paddingBottom: `${100 / ratio}%` }}
  >
    <div className="absolute inset-0">{children}</div>
  </div>
);

export interface TemplateCardProps {
  template: Tables<{ schema: "atsmaster" }, "resume_templates">;
  onSelect: (templateId: string) => void;
}

export default function TemplateCard({ template, onSelect }: TemplateCardProps) {
  const [imgError, setImgError] = React.useState(false);
  const hasThumbnail = !!template.thumbnail_url && !imgError;

  return (
    <Card className="overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg group cursor-pointer">
      <AspectRatio ratio={16 / 9} className="bg-muted">
        {hasThumbnail ? (
          <Image
            src={template.thumbnail_url!}
            alt={template.name}
            fill
            className="object-cover w-full h-full"
            onError={() => setImgError(true)}
            sizes="(max-width: 768px) 100vw, 400px"
            priority={false}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-muted-foreground">
            <ImageIcon className="w-10 h-10" />
          </div>
        )}
      </AspectRatio>
      <CardHeader className="p-4">
        <CardTitle className="text-md font-semibold group-hover:text-primary transition-colors">
          {template.name}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground truncate h-10 line-clamp-2">
          {template.description || "설명이 없습니다."}
        </CardDescription>
      </CardHeader>
      <CardFooter className="p-4 pt-0">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onSelect(template.id)}
          type="button"
        >
          이 템플릿 사용
        </Button>
      </CardFooter>
    </Card>
  );
} 