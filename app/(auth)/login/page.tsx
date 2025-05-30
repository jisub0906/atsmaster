'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/auth/AuthForm';
import { useUserStore } from '@/stores/userStore';

/**
 * LoginPage: 사용자 로그인을 위한 페이지
 * - 이미 로그인된 사용자는 /dashboard로 리디렉션
 * - 중앙 정렬된 레이아웃, 제목 및 AuthForm(mode='login') 렌더링
 */
const LoginPage = () => {
  const router = useRouter();
  const { user, isLoadingAuth } = useUserStore();

  useEffect(() => {
    if (!isLoadingAuth && user) {
      router.replace('/dashboard');
    }
  }, [user, isLoadingAuth, router]);

  return (
    <div className="flex items-center justify-center min-h-screen py-12">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-2xl font-bold text-center">로그인</h1>
        <AuthForm mode="login" />
      </div>
    </div>
  );
};

export default LoginPage; 