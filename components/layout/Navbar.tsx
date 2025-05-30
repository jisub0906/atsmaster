"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { createClient } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { LogOut, UserCircle, Rocket, Menu } from "lucide-react";
import type { Tables } from "@/types/supabase_atsmaster";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile: rawProfile, isLoadingAuth, clearUserSession } = useUserStore();
  const profile = rawProfile as Tables<'profiles'> | null;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const supabase = createClient();

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      clearUserSession();
      router.push("/");
    } catch (err) {
      toast.error("로그아웃 중 오류가 발생했습니다.");
    }
  };

  // 네비게이션 링크 정의
  const navLinks = [
    { href: "/dashboard", label: "대시보드" },
    { href: "/editor/new", label: "새 이력서" },
  ];

  // 프로필 이름/이메일 일부 추출
  let displayName = "";
  let avatarUrl: string | undefined = undefined;
  if (profile && typeof profile === "object" && profile !== null) {
    if (typeof (profile as any).full_name === "string" && (profile as any).full_name) {
      displayName = (profile as any).full_name;
    }
    if (typeof (profile as any).avatar_url === "string" && (profile as any).avatar_url) {
      avatarUrl = (profile as any).avatar_url;
    }
  }
  if (!displayName && user?.email) {
    displayName = user.email.split("@")[0];
  }
  const avatarFallback = displayName ? String(displayName[0]) : "U";

  // 모바일 메뉴 닫힘 시 스크롤 방지 해제
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="w-full border-b bg-background/95 sticky top-0 z-40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2 select-none">
          <Rocket className="w-6 h-6 text-primary" />
          <span className="text-2xl font-bold text-primary tracking-tight">ATSMaster</span>
        </Link>

        {/* 데스크탑 네비게이션 (md 이상) */}
        <nav className="hidden md:flex items-center gap-6">
          {user && navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary text-muted-foreground ${pathname === link.href ? "text-primary" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* 인증/프로필 영역 */}
        <div className="flex items-center gap-2">
          {/* 로딩 상태 */}
          {isLoadingAuth ? (
            <>
              <Skeleton className="w-[80px] h-9 rounded-md" />
              <Skeleton className="w-[80px] h-9 rounded-md ml-2" />
            </>
          ) : user ? (
            // 로그인 상태: 프로필 드롭다운
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 px-2">
                  <Avatar className="w-7 h-7">
                    <AvatarImage src={avatarUrl} alt={displayName} />
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                  </Avatar>
                  <span className="max-w-[100px] truncate text-sm font-medium">{displayName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <UserCircle className="w-4 h-4" /> 내 프로필
                  </Link>
                </DropdownMenuItem> */}
                <DropdownMenuItem onSelect={handleLogout} className="flex items-center gap-2 cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" /> 로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // 비로그인 상태: 로그인/회원가입 버튼
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">로그인</Button>
              </Link>
              <Link href="/signup" className="ml-2">
                <Button variant="default" size="sm">회원가입</Button>
              </Link>
            </>
          )}

          {/* 모바일 메뉴 (md 미만) */}
          <div className="md:hidden ml-2">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="p-2">
                  <Menu className="w-6 h-6" />
                  <span className="sr-only">모바일 메뉴 열기</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 p-0">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 px-4 py-4 border-b">
                    <Rocket className="w-5 h-5 text-primary" />
                    <span className="text-lg font-bold text-primary">ATSMaster</span>
                  </div>
                  <nav className="flex flex-col gap-1 px-4 py-4">
                    {user && navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`block py-2 px-2 rounded text-sm font-medium transition-colors hover:bg-accent/30 ${pathname === link.href ? "text-primary font-semibold" : "text-muted-foreground"}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-auto px-4 py-4 border-t flex flex-col gap-2">
                    {isLoadingAuth ? (
                      <>
                        <Skeleton className="w-full h-9 rounded-md" />
                        <Skeleton className="w-full h-9 rounded-md" />
                      </>
                    ) : user ? (
                      <Button variant="outline" size="sm" className="w-full flex items-center gap-2" onClick={handleLogout}>
                        <LogOut className="w-4 h-4" /> 로그아웃
                      </Button>
                    ) : (
                      <>
                        <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="outline" size="sm" className="w-full">로그인</Button>
                        </Link>
                        <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="default" size="sm" className="w-full mt-2">회원가입</Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
} 