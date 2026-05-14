import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/features/auth/components/auth-card";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your Car Tuning Shop account.",
};

export default function LoginPage() {
  return (
    <AuthCard
      description="Access your account to manage cart and orders."
      title="Login"
    >
      <Suspense fallback={<div className="h-56 animate-pulse rounded-md bg-zinc-100" />}>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
