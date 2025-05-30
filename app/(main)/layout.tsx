import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// MainAppLayout: ATS마스터 주요 기능 페이지 공통 레이아웃
//
// (선택적) 인증 가드 예시:
// useEffect와 useUserStore, useRouter를 사용하여,
// isLoadingAuth가 false이고 user가 null이면 '/login'으로 리디렉션하는 로직을 추가할 수 있습니다.
// 단, 이 로직은 Next.js 미들웨어(middleware.ts)에서 처리하는 것이 더 권장됩니다.

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
} 