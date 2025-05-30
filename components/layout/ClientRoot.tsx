'use client';

import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { createClient } from "@/lib/supabaseClient";
import { useUserStore } from "@/stores/userStore";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";
import type { Tables, Database } from "@/types/supabase_atsmaster";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // SupabaseClient<Database, any, any>로 타입 지정 (스키마 강제 지정 오류 회피)
    const supabase = createClient() as SupabaseClient<Database, any, any>;
    const userStore = useUserStore.getState();

    // 인증 상태 변경 리스너 (비동기 로직은 setTimeout으로 분리)
    const { data: { subscription } = { subscription: undefined } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setTimeout(async () => {
          if (event === "SIGNED_IN" && session?.user) {
            await userStore.fetchUserProfile(session.user.id, supabase);
            userStore.setUserAndProfile(session.user, useUserStore.getState().profile);
          } else if (event === "SIGNED_OUT") {
            userStore.clearUserSession();
          }
          userStore.setIsLoadingAuth(false);
        }, 0);
      }
    );

    // 앱 최초 로드시 세션 확인
    const checkInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await userStore.fetchUserProfile(session.user.id, supabase);
        userStore.setUserAndProfile(session.user, useUserStore.getState().profile);
      }
      userStore.setIsLoadingAuth(false);
    };
    checkInitialSession();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <>
      {children}
      <Toaster />
    </>
  );
} 