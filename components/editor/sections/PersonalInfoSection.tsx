import type { PersonalInfoSection } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';

export interface PersonalInfoSectionProps {
  data?: PersonalInfoSection | null;
  onChange: (fieldName: keyof PersonalInfoSection, value: string) => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ data, onChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>개인 정보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 이름 */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              value={data?.name || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('name', e.target.value)}
              placeholder="홍길동"
              autoComplete="name"
            />
          </div>
          {/* 이메일 */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              value={data?.email || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('email', e.target.value)}
              placeholder="example@email.com"
              autoComplete="email"
            />
          </div>
          {/* 전화번호 */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="phone">전화번호</Label>
            <Input
              id="phone"
              type="tel"
              value={data?.phone || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('phone', e.target.value)}
              placeholder="010-1234-5678"
              autoComplete="tel"
            />
          </div>
          {/* 주소 (선택) */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="address">주소</Label>
            <Input
              id="address"
              value={data?.address || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('address', e.target.value)}
              placeholder="서울시 강남구 (선택 사항)"
              autoComplete="address-level2"
            />
          </div>
          {/* LinkedIn (선택) */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="linkedin">LinkedIn 프로필 URL</Label>
            <Input
              id="linkedin"
              type="url"
              value={data?.linkedin || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('linkedin', e.target.value)}
              placeholder="linkedin.com/in/..."
              autoComplete="url"
            />
          </div>
          {/* 포트폴리오 (선택) */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="portfolio">포트폴리오/웹사이트 URL</Label>
            <Input
              id="portfolio"
              type="url"
              value={data?.portfolio || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('portfolio', e.target.value)}
              placeholder="https://your-portfolio.com"
              autoComplete="url"
            />
          </div>
        </div>
        {/* 프로필 요약 */}
        <div className="flex flex-col space-y-1">
          <Label htmlFor="profile_summary">프로필 요약 (2-3줄)</Label>
          <Textarea
            id="profile_summary"
            value={data?.profile_summary || ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange('profile_summary', e.target.value)}
            placeholder="핵심 역량을 강조하는 간략한 자기소개를 작성하세요."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoSection; 