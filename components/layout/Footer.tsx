import React from "react";

/**
 * ATS마스터(ATSMaster) 애플리케이션의 하단 푸터 컴포넌트입니다.
 * - 저작권 문구(동적 연도) 표시
 * - Tailwind CSS 기반 스타일링
 * - MVP 기준: 추가 링크(이용약관, 개인정보처리방침)는 생략
 */
const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto py-6 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} ATSMaster. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer; 