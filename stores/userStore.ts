import { create } from 'zustand';
import { type SupabaseClient, type User } from '@supabase/supabase-js';
import { type Database, type Tables } from '@/types/supabase_atsmaster';

/**
 * UserState: Zustand 스토어 인터페이스
 */
export interface UserState {
  user: User | null;
  profile: Tables<'profiles'> | null;
  isLoadingAuth: boolean; // 인증 상태 로딩 (최초 로드 시)
  isLoadingProfile: boolean; // 프로필 정보 로딩
  setUserAndProfile: (user: User | null, profile?: Tables<'profiles'> | null) => void;
  fetchUserProfile: (userId: string, supabaseClient: SupabaseClient<Database>) => Promise<void>;
  clearUserSession: () => void;
  setIsLoadingAuth: (loading: boolean) => void;
}

/**
 * useUserStore: 사용자 인증 및 프로필 상태를 관리하는 Zustand 스토어
 */
export const useUserStore = create<UserState>((set) => ({
  user: null,
  profile: null,
  isLoadingAuth: true,
  isLoadingProfile: false,

  setUserAndProfile: (user, profile = null) => {
    set({ user, profile });
  },

  fetchUserProfile: async (userId, supabaseClient) => {
    set({ isLoadingProfile: true });
    try {
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) {
        // 에러 발생 시 profile을 null로 설정
        // (UI 단에서 사용자 알림 처리 권장)
        set({ profile: null });
        console.error('[userStore] fetchUserProfile error:', error);
      } else {
        set({ profile: data });
      }
    } catch (err) {
      set({ profile: null });
      console.error('[userStore] fetchUserProfile exception:', err);
    } finally {
      set({ isLoadingProfile: false });
    }
  },

  clearUserSession: () => {
    set({ user: null, profile: null });
  },

  setIsLoadingAuth: (loading) => {
    set({ isLoadingAuth: loading });
  },
}));

/**
 * 참고: Supabase 인증 상태 변경 감지는 앱의 클라이언트 사이드 진입점(예: RootLayout)에서 처리하는 것이 좋습니다.
 *
 * 예시 코드:
 *
 * // useEffect(() => {
 * //   const supabase = supabaseBrowserClient(); // lib/client.ts에서 가져옴
 * //   const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
 * //     const userStore = useUserStore.getState();
 * //     if (event === 'SIGNED_IN' && session?.user) {
 * //       await userStore.fetchUserProfile(session.user.id, supabase); // 프로필도 함께 가져옴
 * //       userStore.setUserAndProfile(session.user, useUserStore.getState().profile); // 최신 프로필과 함께 설정
 * //     } else if (event === 'SIGNED_OUT') {
 * //       userStore.clearUserSession();
 * //     }
 * //     userStore.setIsLoadingAuth(false);
 * //   });
 * //   // 초기 인증 상태 확인
 * //   const checkInitialSession = async () => {
 * //      const { data: { session } } = await supabase.auth.getSession();
 * //      if (session?.user) {
 * //          await userStore.fetchUserProfile(session.user.id, supabase);
 * //          userStore.setUserAndProfile(session.user, useUserStore.getState().profile);
 * //      }
 * //      userStore.setIsLoadingAuth(false);
 * //   };
 * //   checkInitialSession();
 * //   return () => { authListener?.unsubscribe(); };
 * // }, []);
 */ 