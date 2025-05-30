/**
 * ATS마스터(ATSMaster) 프로젝트 공통 타입 정의
 * atsmaster.resumes.content JSONB 필드 구조 명확화 목적
 * PRD 6.4 예시 데이터 및 5.2 FEAT-005 입력 UI 명세 기반
 */

/**
 * 각 이력서 항목의 고유 ID를 위한 기본 인터페이스
 */
export interface EditorSectionBase {
  /** UUID 형태의 고유 ID */
  id: string;
}

/**
 * 개인정보(이름, 연락처 등) 섹션 타입
 */
export interface PersonalInfoSection {
  /** 이름 */
  name?: string;
  /** 이메일 */
  email?: string;
  /** 전화번호 */
  phone?: string;
  /** 주소(도시 등, 상세 주소는 선택) */
  address?: string;
  /** LinkedIn URL */
  linkedin?: string;
  /** 포트폴리오 URL */
  portfolio?: string;
  /** 간략 자기소개/직무 요약 */
  profile_summary?: string;
}

/**
 * 학력 항목 타입
 */
export interface EducationItem extends EditorSectionBase {
  /** 학교명 */
  school_name?: string;
  /** 전공 */
  major?: string;
  /** 학위 (예: '학사', '석사') */
  degree?: string;
  /** 입학일 (YYYY-MM 또는 YYYY) */
  start_date?: string;
  /** 졸업일 (YYYY-MM 또는 YYYY, 재학 중일 경우 비워둘 수 있음) */
  end_date?: string;
  /** 학점 (예: '3.8/4.5') */
  gpa?: string;
  /** 주요 성과/활동 (줄바꿈 포함 가능) */
  achievements?: string;
}

/**
 * 경력(경험) 항목 타입
 */
export interface ExperienceItem extends EditorSectionBase {
  /** 회사명 */
  company_name?: string;
  /** 직책 */
  position?: string;
  /** 입사일 (YYYY-MM) */
  start_date?: string;
  /** 퇴사일 (YYYY-MM, 재직 중일 경우 'Present' 또는 비워둠) */
  end_date?: string;
  /** 주요 업무/성과 (Markdown, 줄바꿈 포함 가능) */
  responsibilities?: string;
  /** 재직 중 여부 */
  is_current?: boolean;
}

/**
 * 기술 항목 타입
 */
export interface SkillItem extends EditorSectionBase {
  /** 기술명 (예: 'JavaScript', 'React') */
  name?: string;
  /** 숙련도 (예: '상', '중', '하' 또는 자유 입력) */
  level?: '상' | '중' | '하' | string;
  /** 카테고리 (예: 'Frontend', 'Backend', 'Language') */
  category?: string;
}

/**
 * 프로젝트 항목 타입
 */
export interface ProjectItem extends EditorSectionBase {
  /** 프로젝트명 */
  project_name?: string;
  /** 프로젝트 설명 */
  description?: string;
  /** 시작일 (YYYY-MM) */
  start_date?: string;
  /** 종료일 (YYYY-MM) */
  end_date?: string;
  /** 프로젝트 내 역할 */
  role?: string;
  /** 사용 기술 목록 */
  technologies_used?: string[];
  /** 결과물 링크 (URL) */
  project_link?: string;
  /** 주요 성과 (줄바꿈 포함 가능) */
  key_achievements?: string;
}

/**
 * 자기소개서(커버레터) 섹션 타입 (여러 개 가능)
 */
export interface CoverLetterSection extends EditorSectionBase {
  /** 자기소개서 제목 */
  title?: string;
  /** 자기소개서 내용 */
  content?: string;
}

/**
 * 커스텀 섹션의 개별 항목 타입
 */
export interface CustomSectionItem extends EditorSectionBase {
  /** 항목 제목 */
  item_title?: string;
  /** 항목 부제목 */
  item_subtitle?: string;
  /** 시작일 */
  item_start_date?: string;
  /** 종료일 */
  item_end_date?: string;
  /** 항목 설명 */
  item_description?: string;
}

/**
 * 사용자가 직접 추가하는 커스텀 섹션 타입
 */
export interface CustomSection extends EditorSectionBase {
  /** 섹션 제목 */
  section_title: string;
  /** 섹션 내 항목 목록 */
  items: CustomSectionItem[];
}

/**
 * 이력서 콘텐츠 메인 구조 (atsmaster.resumes.content)
 */
export interface ResumeContent {
  /** 개인정보 섹션 */
  personal_info?: PersonalInfoSection;
  /** 학력 목록 */
  education?: EducationItem[];
  /** 경력 목록 */
  experience?: ExperienceItem[];
  /** 기술 목록 */
  skills?: SkillItem[];
  /** 프로젝트 목록 */
  projects?: ProjectItem[];
  /** 자기소개서(커버레터) 목록 */
  cover_letters?: CoverLetterSection[];
  /** 커스텀 섹션 목록 */
  custom_sections?: CustomSection[];
  /** 사용된 템플릿 ID (선택) */
  template_id?: string;
  /** 섹션 표시 순서 (각 섹션의 id 또는 고유 key) */
  sections_order?: string[];
} 