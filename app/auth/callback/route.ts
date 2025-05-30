import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabaseServer';
import { type Database } from '@/types/supabase_atsmaster';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  // (Optional) Support for redirecting to original destination
  const nextUrl = url.searchParams.get('next');

  if (!code) {
    console.error('No code found in callback URL.');
    return NextResponse.redirect(new URL('/auth/login?error=auth_callback_no_code', request.url));
  }

  try {
    // Supabase 서버 클라이언트 인스턴스화 (쿠키 연동)
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error('Failed to exchange code for session:', error.message);
      return NextResponse.redirect(new URL('/auth/login?error=auth_callback_failed', request.url));
    }
    // 성공 시 next 파라미터가 있으면 해당 경로로, 없으면 /dashboard로 이동
    const redirectTo = nextUrl && nextUrl.startsWith('/') ? nextUrl : '/dashboard';
    return NextResponse.redirect(new URL(redirectTo, request.url));
  } catch (err) {
    console.error('Unexpected error during auth callback:', err);
    return NextResponse.redirect(new URL('/auth/login?error=auth_callback_exception', request.url));
  }
} 