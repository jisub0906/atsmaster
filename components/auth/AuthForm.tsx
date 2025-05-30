"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { AuthApiError } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export interface AuthFormProps {
  mode: "login" | "signup";
}

const loginSchema = z.object({
  email: z.string().email({ message: "유효한 이메일을 입력해주세요." }),
  password: z.string().min(6, { message: "비밀번호는 최소 6자 이상이어야 합니다." }),
});

const signupSchema = loginSchema.extend({
  confirmPassword: z
    .string()
    .min(6, { message: "비밀번호 확인은 최소 6자 이상이어야 합니다." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

type FormValues = LoginFormValues | SignupFormValues;

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const isSignup = mode === "signup";

  const form = useForm<FormValues>({
    resolver: zodResolver(isSignup ? signupSchema : loginSchema),
    defaultValues: isSignup
      ? { email: "", password: "", confirmPassword: "" }
      : { email: "", password: "" },
    mode: "onTouched",
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: FormValues) => {
    const supabase = createClient();
    try {
      if (mode === "login") {
        const { email, password } = values as LoginFormValues;
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error instanceof AuthApiError) {
            toast.error(error.message || "이메일 또는 비밀번호가 잘못되었습니다.");
          } else {
            toast.error("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
          }
          return;
        }
        router.push("/dashboard");
      } else {
        const { email, password } = values as SignupFormValues;
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
          if (error instanceof AuthApiError) {
            toast.error(error.message || "회원가입 중 오류가 발생했습니다.");
          } else {
            toast.error("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
          }
          return;
        }
        // 이메일 확인 필요 (MVP 가정)
        if (data.user && !data.session) {
          toast.info("회원가입 확인 메일이 발송되었습니다. 이메일을 확인해주세요.");
          router.push("/login");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      toast.error("알 수 없는 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="flex min-h-[400px] w-full max-w-md flex-col items-center justify-center mx-auto py-8">
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full space-y-6 bg-background rounded-lg shadow-md p-8"
          autoComplete="off"
        >
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight">
              {mode === "login" ? "로그인" : "회원가입"}
            </h2>
          </div>
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <Input type="email" autoComplete="email" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete={isSignup ? "new-password" : "current-password"} {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isSignup && (
            <FormField
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호 확인</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "login" ? "로그인" : "회원가입"}
          </Button>
          <div className="mt-2 text-center">
            {mode === "login" ? (
              <Link href="/signup" className="text-sm text-muted-foreground hover:underline">
                계정이 없으신가요? 회원가입
              </Link>
            ) : (
              <Link href="/login" className="text-sm text-muted-foreground hover:underline">
                이미 계정이 있으신가요? 로그인
              </Link>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
} 