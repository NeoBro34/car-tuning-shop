"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { loginSchema, type LoginFormValues } from "@/features/auth/auth.schema";
import { useAuthStore } from "@/store/auth-store";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    clearError,
    error,
    isAuthenticated,
    isHydrated,
    isLoading,
    login,
  } = useAuthStore();
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });
  const redirectTo = searchParams.get("redirect") ?? "/products";

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isHydrated, redirectTo, router]);

  async function onSubmit(values: LoginFormValues) {
    clearError();

    try {
      await login(values);
      toast.success("Logged in successfully");
      router.replace(redirectTo);
    } catch {
      toast.error("Login failed");
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <label className="block">
        <span className="text-sm font-semibold text-zinc-700">Email</span>
        <input
          className="mt-2 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
          type="email"
          {...register("email")}
        />
        {errors.email ? (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        ) : null}
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-zinc-700">Password</span>
        <input
          className="mt-2 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
          type="password"
          {...register("password")}
        />
        {errors.password ? (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        ) : null}
      </label>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <button className="btn-primary w-full" disabled={isLoading} type="submit">
        {isLoading ? "Logging in..." : "Login"}
      </button>

      <p className="text-center text-sm text-zinc-600">
        No account?{" "}
        <Link className="font-semibold text-red-600" href="/register">
          Register
        </Link>
      </p>
    </form>
  );
}
