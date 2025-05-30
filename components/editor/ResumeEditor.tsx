import React, { useState, useCallback } from 'react';
import type { Tables, Database } from '@/types/supabase_atsmaster';
import type {
  ResumeContent,
  PersonalInfoSection,
  EducationItem,
  ExperienceItem,
  SkillItem,
  ProjectItem,
  CoverLetterSection,
  CustomSection,
} from '@/types';
import { useResumeStore } from '@/stores/resumeStore';
import { createClient } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import ResumeEditorToolbar from './ResumeEditorToolbar';
import PersonalInfoSectionComponent from './sections/PersonalInfoSection';
import EducationSectionComponent from './sections/EducationSection';
import ExperienceSectionComponent from './sections/ExperienceSection';
import SkillsSectionComponent from './sections/SkillsSection';
import ProjectsSectionComponent from './sections/ProjectsSection';
import CoverLetterSectionComponent from './sections/CoverLetterSection';
import CustomSectionComponent from './sections/CustomSection';
import type { SupabaseClient } from '@supabase/supabase-js';

export interface ResumeEditorProps {
  initialResumeData: Tables<{ schema: 'atsmaster' }, 'resumes'>;
}

const ResumeEditor: React.FC<ResumeEditorProps> = ({ initialResumeData }) => {
  // Supabase 클라이언트 (클라이언트 컴포넌트)
  const supabase = createClient();

  // 상태: 이력서 콘텐츠
  const [resumeContent, setResumeContent] = useState<ResumeContent | null>(() => {
    try {
      if (!initialResumeData?.content) return null;
      if (typeof initialResumeData.content === 'string') {
        return JSON.parse(initialResumeData.content) as ResumeContent;
      }
      return initialResumeData.content as ResumeContent;
    } catch (e) {
      console.error('Failed to parse resume content', e);
      return null;
    }
  });
  // 상태: 이력서 제목
  const [resumeTitle, setResumeTitle] = useState<string>(initialResumeData.title || '새 이력서');

  // Zustand store
  const isSavingResume = useResumeStore((state) => state.isSavingResume);
  const saveCurrentResume = useResumeStore((state) => state.saveCurrentResume);

  // --- 섹션별 onChange 핸들러 ---
  const handlePersonalInfoChange = useCallback(
    (fieldName: keyof PersonalInfoSection, value: string) => {
      setResumeContent((prev) =>
        prev ? { ...prev, personal_info: { ...prev.personal_info, [fieldName]: value } } : prev
      );
    },
    []
  );

  const handleEducationChange = useCallback(
    (updatedEducationList: EducationItem[]) => {
      setResumeContent((prev) =>
        prev ? { ...prev, education: updatedEducationList } : prev
      );
    },
    []
  );

  const handleExperienceChange = useCallback(
    (updatedExperienceList: ExperienceItem[]) => {
      setResumeContent((prev) =>
        prev ? { ...prev, experience: updatedExperienceList } : prev
      );
    },
    []
  );

  const handleSkillsChange = useCallback(
    (updatedSkillsList: SkillItem[]) => {
      setResumeContent((prev) =>
        prev ? { ...prev, skills: updatedSkillsList } : prev
      );
    },
    []
  );

  const handleProjectsChange = useCallback(
    (updatedProjectsList: ProjectItem[]) => {
      setResumeContent((prev) =>
        prev ? { ...prev, projects: updatedProjectsList } : prev
      );
    },
    []
  );

  const handleCoverLettersChange = useCallback(
    (updatedCoverLetters: CoverLetterSection[]) => {
      setResumeContent((prev) =>
        prev ? { ...prev, cover_letters: updatedCoverLetters } : prev
      );
    },
    []
  );

  const handleCustomSectionChange = useCallback(
    (index: number, updatedSection: CustomSection) => {
      setResumeContent((prev) => {
        if (!prev || !prev.custom_sections) return prev;
        const updatedSections = prev.custom_sections.map((section, i) =>
          i === index ? updatedSection : section
        );
        return { ...prev, custom_sections: updatedSections };
      });
    },
    []
  );

  // --- 저장 핸들러 ---
  const handleSave = useCallback(async () => {
    if (!resumeContent) {
      toast.error('이력서 내용이 비어 있습니다.');
      return;
    }
    // Zustand store의 currentResume/currentResumeContent를 동기화
    useResumeStore.getState().updateCurrentResumeContent(resumeContent);
    useResumeStore.getState().updateCurrentResumeDetails({
      id: initialResumeData.id,
      title: resumeTitle,
    });
    // 타입 단언으로 SupabaseClient 타입 오류 우회
    const result = await saveCurrentResume(supabase as unknown as SupabaseClient<Database, 'atsmaster', any>);
    if (result) {
      toast.success('저장되었습니다!');
    } else {
      toast.error('저장 중 오류가 발생했습니다.');
    }
  }, [resumeContent, resumeTitle, initialResumeData.id, saveCurrentResume, supabase]);

  // --- PDF 내보내기 핸들러 (MVP) ---
  const handleExportPdf = useCallback(() => {
    toast.info('PDF 내보내기 기능은 준비 중입니다.');
  }, []);

  // --- 렌더링 ---
  if (!resumeContent) {
    return (
      <div className="text-center text-destructive py-12">이력서 내용을 불러올 수 없습니다.</div>
    );
  }

  return (
    <div>
      <ResumeEditorToolbar
        resumeTitle={resumeTitle}
        isSaving={isSavingResume}
        lastSaved={initialResumeData.updated_at}
        onSave={handleSave}
        onExportPdf={handleExportPdf}
        onTitleChange={setResumeTitle}
      />
      <div className="p-4 md:p-6 lg:p-8 space-y-8 max-w-4xl mx-auto">
        <PersonalInfoSectionComponent
          data={resumeContent.personal_info}
          onChange={handlePersonalInfoChange}
        />
        <EducationSectionComponent
          data={resumeContent.education}
          onChange={handleEducationChange}
        />
        <ExperienceSectionComponent
          data={resumeContent.experience}
          onChange={handleExperienceChange}
        />
        <SkillsSectionComponent
          data={resumeContent.skills}
          onChange={handleSkillsChange}
        />
        <ProjectsSectionComponent
          data={resumeContent.projects}
          onChange={handleProjectsChange}
        />
        <CoverLetterSectionComponent
          data={resumeContent.cover_letters}
          onChange={handleCoverLettersChange}
        />
        {Array.isArray(resumeContent.custom_sections) && resumeContent.custom_sections.length > 0 &&
          resumeContent.custom_sections.map((section, idx) => (
            <CustomSectionComponent
              key={section.id}
              section={section}
              onChange={(updatedSection) => handleCustomSectionChange(idx, updatedSection)}
            />
          ))}
      </div>
    </div>
  );
};

export default ResumeEditor; 