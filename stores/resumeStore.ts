import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { type SupabaseClient } from '@supabase/supabase-js';
import { type Database, type Tables } from '@/types/supabase_atsmaster';
import { type ResumeContent } from '@/types';

// 타입 별칭 for Row types
export type ResumeRow = Tables<{ schema: 'atsmaster' }, 'resumes'>;
export type ResumeTemplateRow = Tables<{ schema: 'atsmaster' }, 'resume_templates'>;

export interface ResumeState {
  resumes: ResumeRow[];
  currentResume: ResumeRow | null;
  currentResumeContent: ResumeContent | null;
  templates: ResumeTemplateRow[];
  isLoadingResumes: boolean;
  isLoadingCurrentResume: boolean;
  isLoadingTemplates: boolean;
  isSavingResume: boolean;
  error: string | null;
  fetchResumes: (userId: string, supabaseClient: SupabaseClient<Database>) => Promise<void>;
  fetchResumeById: (resumeId: string, supabaseClient: SupabaseClient<Database>) => Promise<ResumeRow | null>;
  createResume: (
    newResumeData: { title: string; content: ResumeContent; template_id?: string; user_id: string },
    supabaseClient: SupabaseClient<Database>
  ) => Promise<ResumeRow | null>;
  updateCurrentResumeDetails: (updates: Partial<ResumeRow>) => void;
  updateCurrentResumeContent: (newContent: Partial<ResumeContent>) => void;
  saveCurrentResume: (supabaseClient: SupabaseClient<Database>) => Promise<boolean>;
  deleteResume: (resumeId: string, supabaseClient: SupabaseClient<Database>) => Promise<boolean>;
  selectResume: (resume: ResumeRow | null) => void;
  clearCurrentResume: () => void;
  fetchTemplates: (supabaseClient: SupabaseClient<Database>) => Promise<void>;
}

export const useResumeStore = create<ResumeState>()(
  immer((set, get) => ({
    resumes: [],
    currentResume: null,
    currentResumeContent: null,
    templates: [],
    isLoadingResumes: false,
    isLoadingCurrentResume: false,
    isLoadingTemplates: false,
    isSavingResume: false,
    error: null,

    fetchResumes: async (userId, supabaseClient) => {
      set((state) => {
        state.isLoadingResumes = true;
        state.error = null;
      });
      try {
        const { data, error } = await supabaseClient
          .from('resumes')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });
        if (error) throw error;
        set((state) => {
          state.resumes = (data || []) as ResumeRow[];
        });
      } catch (err: any) {
        set((state) => {
          state.error = err.message || '이력서 목록 조회 중 오류가 발생했습니다.';
          state.resumes = [];
        });
      } finally {
        set((state) => {
          state.isLoadingResumes = false;
        });
      }
    },

    fetchResumeById: async (resumeId, supabaseClient) => {
      set((state) => {
        state.isLoadingCurrentResume = true;
        state.error = null;
      });
      try {
        const { data, error } = await supabaseClient
          .from('resumes')
          .select('*')
          .eq('id', resumeId)
          .single();
        if (error || !data) throw error || new Error('이력서를 찾을 수 없습니다.');
        let parsedContent: ResumeContent | null = null;
        try {
          parsedContent = typeof data.content === 'string' ? JSON.parse(data.content) : (data.content as ResumeContent);
        } catch {
          parsedContent = null;
        }
        set((state) => {
          state.currentResume = data as ResumeRow;
          state.currentResumeContent = parsedContent;
        });
        return data as ResumeRow;
      } catch (err: any) {
        set((state) => {
          state.error = err.message || '이력서 조회 중 오류가 발생했습니다.';
        });
        return null;
      } finally {
        set((state) => {
          state.isLoadingCurrentResume = false;
        });
      }
    },

    createResume: async (newResumeData, supabaseClient) => {
      set((state) => {
        state.isSavingResume = true;
        state.error = null;
      });
      try {
        const insertData = {
          ...newResumeData,
          content: JSON.stringify(newResumeData.content),
        };
        const { data, error } = await supabaseClient
          .from('resumes')
          .insert(insertData)
          .select()
          .single();
        if (error || !data) throw error || new Error('이력서 생성에 실패했습니다.');
        set((state) => {
          state.resumes.unshift(data as ResumeRow);
          state.currentResume = data as ResumeRow;
          state.currentResumeContent = typeof data.content === 'string' ? JSON.parse(data.content) : (data.content as ResumeContent);
        });
        return data as ResumeRow;
      } catch (err: any) {
        set((state) => {
          state.error = err.message || '이력서 생성 중 오류가 발생했습니다.';
        });
        return null;
      } finally {
        set((state) => {
          state.isSavingResume = false;
        });
      }
    },

    updateCurrentResumeDetails: (updates) => {
      set((state) => {
        if (state.currentResume) {
          state.currentResume = { ...state.currentResume, ...updates };
        }
      });
    },

    updateCurrentResumeContent: (newContent) => {
      set((state) => {
        if (state.currentResumeContent) {
          state.currentResumeContent = { ...state.currentResumeContent, ...newContent };
        }
      });
    },

    saveCurrentResume: async (supabaseClient) => {
      const { currentResume, currentResumeContent } = get();
      if (!currentResume || !currentResumeContent) return false;
      set((state) => {
        state.isSavingResume = true;
        state.error = null;
      });
      try {
        const updates = {
          content: JSON.stringify(currentResumeContent),
          title: currentResume.title,
          updated_at: new Date().toISOString(),
        };
        const { data, error } = await supabaseClient
          .from('resumes')
          .update(updates)
          .eq('id', currentResume.id)
          .select()
          .single();
        if (error || !data) throw error || new Error('이력서 저장에 실패했습니다.');
        set((state) => {
          state.currentResume = data as ResumeRow;
          state.currentResumeContent = typeof data.content === 'string' ? JSON.parse(data.content) : (data.content as ResumeContent);
          // 목록도 동기화
          const idx = state.resumes.findIndex((r: ResumeRow) => r.id === data.id);
          if (idx !== -1) state.resumes[idx] = data as ResumeRow;
        });
        return true;
      } catch (err: any) {
        set((state) => {
          state.error = err.message || '이력서 저장 중 오류가 발생했습니다.';
        });
        return false;
      } finally {
        set((state) => {
          state.isSavingResume = false;
        });
      }
    },

    deleteResume: async (resumeId, supabaseClient) => {
      set((state) => {
        state.error = null;
      });
      try {
        const { error } = await supabaseClient
          .from('resumes')
          .delete()
          .eq('id', resumeId);
        if (error) throw error;
        set((state) => {
          state.resumes = state.resumes.filter((r: ResumeRow) => r.id !== resumeId);
          if (state.currentResume?.id === resumeId) {
            state.currentResume = null;
            state.currentResumeContent = null;
          }
        });
        return true;
      } catch (err: any) {
        set((state) => {
          state.error = err.message || '이력서 삭제 중 오류가 발생했습니다.';
        });
        return false;
      }
    },

    selectResume: (resume) => {
      set((state) => {
        state.currentResume = resume;
        if (resume) {
          try {
            state.currentResumeContent = typeof resume.content === 'string' ? JSON.parse(resume.content as string) : (resume.content as ResumeContent);
          } catch {
            state.currentResumeContent = null;
          }
        } else {
          state.currentResumeContent = null;
        }
      });
    },

    clearCurrentResume: () => {
      set((state) => {
        state.currentResume = null;
        state.currentResumeContent = null;
      });
    },

    fetchTemplates: async (supabaseClient) => {
      set((state) => {
        state.isLoadingTemplates = true;
        state.error = null;
      });
      try {
        const { data, error } = await supabaseClient
          .from('resume_templates')
          .select('*')
          .order('order', { ascending: true });
        if (error) throw error;
        set((state) => {
          state.templates = (data || []) as ResumeTemplateRow[];
        });
      } catch (err: any) {
        set((state) => {
          state.error = err.message || '템플릿 목록 조회 중 오류가 발생했습니다.';
          state.templates = [];
        });
      } finally {
        set((state) => {
          state.isLoadingTemplates = false;
        });
      }
    },
  }))
); 