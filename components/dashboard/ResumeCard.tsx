"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { toast } from "sonner";
import type { Tables } from "@/types/supabase_atsmaster";

export interface ResumeCardProps {
  resume: Tables<{ schema: "atsmaster" }, "resumes">;
  onEdit: (resumeId: string) => void;
  onDelete: (resumeId: string) => Promise<void>;
}

const ResumeCard = ({ resume, onEdit, onDelete }: ResumeCardProps) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formattedUpdatedAt = resume.updated_at
    ? format(new Date(resume.updated_at), "yyyy년 MM월 dd일 HH:mm", { locale: ko })
    : "-";

  const handleDeleteClick = () => {
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(resume.id);
      toast.success("이력서가 삭제되었습니다.");
    } catch (error) {
      toast.error("삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
      setIsAlertOpen(false);
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle
            className="text-lg truncate"
            title={resume.title || undefined}
          >
            {resume.title}
          </CardTitle>
          <CardDescription>
            마지막 수정: {formattedUpdatedAt}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-end space-x-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(resume.id)}
            type="button"
          >
            <Pencil className="mr-2 h-4 w-4" /> 수정
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteClick}
            disabled={isDeleting}
            type="button"
          >
            {isDeleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            삭제
          </Button>
        </CardFooter>
      </Card>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>삭제 확인</AlertDialogTitle>
            <AlertDialogDescription>
              정말 '{resume.title}' 이력서를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ResumeCard; 