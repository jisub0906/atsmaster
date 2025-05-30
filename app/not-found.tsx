import { FileQuestion } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-background">
      <FileQuestion className="h-16 w-16 text-primary" aria-hidden="true" />
      <h1 className="text-3xl md:text-4xl font-bold mt-4">404 - 페이지를 찾을 수 없습니다.</h1>
      <p className="text-muted-foreground mt-2">
        요청하신 페이지가 존재하지 않거나, 현재 사용할 수 없는 페이지입니다.<br />
        입력하신 주소가 정확한지 다시 한번 확인해주세요.
      </p>
      <Link href="/">
        <Button variant="default" className="mt-6">
          홈으로 돌아가기
        </Button>
      </Link>
    </div>
  );
} 