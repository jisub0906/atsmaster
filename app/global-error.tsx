'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

interface GlobalErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalErrorPage({ error, reset }: GlobalErrorPageProps) {
  useEffect(() => {
    // 콘솔 로깅 (향후 Sentry 등 외부 로깅 서비스 연동 지점)
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <AlertTriangle className="h-12 w-12 text-destructive" />
      <h1 className="text-2xl md:text-3xl font-semibold mt-4">문제가 발생했습니다.</h1>
      <p className="text-muted-foreground mt-2">
        서비스 이용에 불편을 드려 죄송합니다. 잠시 후 다시 시도해주시거나 문제가 지속되면 문의해주십시오.
      </p>
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 text-left w-full max-w-md mx-auto bg-muted rounded p-4 text-sm text-destructive">
          <div className="font-bold mb-1">[개발 환경] 오류 상세 정보</div>
          <div><span className="font-semibold">message:</span> {error.message}</div>
          {error.digest && <div><span className="font-semibold">digest:</span> {error.digest}</div>}
        </div>
      )}
      <Button className="mt-6" variant="default" onClick={reset}>
        다시 시도
      </Button>
      <Link href="/" className="mt-2">
        <Button variant="ghost">홈으로 돌아가기</Button>
      </Link>
    </div>
  );
} 