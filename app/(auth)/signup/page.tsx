'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/auth/AuthForm';
import { useUserStore } from '@/stores/userStore';

/**
 * SignupPage: 사용자 회원가입을 위한 페이지
 * - 이미 로그인된 사용자는 /dashboard로 리디렉션
 * - 중앙 정렬된 레이아웃, 제목 및 AuthForm(mode='signup') 렌더링
 */
const SignupPage = () => {
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
        <h1 className="text-2xl font-bold text-center">회원가입</h1>
        <AuthForm mode="signup" />
      </div>
    </div>
  );
};

export default SignupPage; 