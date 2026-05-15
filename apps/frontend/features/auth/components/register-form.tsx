"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/auth.schema";
import { useAuthStore } from "@/store/auth-store";

export function RegisterForm() {
  const auth = useTranslations("Auth");
  const common = useTranslations("Common");
  const router = useRouter();
  const {
    clearError,
    error,
    isAuthenticated,
    isHydrated,
    isLoading,
    register: registerAccount,
  } = useAuthStore();
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<RegisterFormValues>({
    defaultValues: {
      confirmPassword: "",
      email: "",
      full_name: "",
      password: "",
    },
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace("/products");
    }
  }, [isAuthenticated, isHydrated, router]);

  async function onSubmit(values: RegisterFormValues) {
    clearError();

    try {
      await registerAccount({
        email: values.email,
        full_name: values.full_name?.trim() || null,
        password: values.password,
      });
      toast.success(auth("registerSuccess"));
      router.replace("/products");
    } catch {
      toast.error(auth("registerFailed"));
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <label className="block">
        <span className="text-sm font-bold text-zinc-300">{auth("fullName")}</span>
        <input
          className="auto-input mt-2 w-full rounded-md px-3 py-2 text-sm"
          type="text"
          {...register("full_name")}
        />
        {errors.full_name ? (
          <p className="mt-1 text-sm text-red-300">
            {errors.full_name.message}
          </p>
        ) : null}
      </label>

      <label className="block">
        <span className="text-sm font-bold text-zinc-300">{common("email")}</span>
        <input
          className="auto-input mt-2 w-full rounded-md px-3 py-2 text-sm"
          type="email"
          {...register("email")}
        />
        {errors.email ? (
          <p className="mt-1 text-sm text-red-300">{errors.email.message}</p>
        ) : null}
      </label>

      <label className="block">
        <span className="text-sm font-bold text-zinc-300">{common("password")}</span>
        <input
          className="auto-input mt-2 w-full rounded-md px-3 py-2 text-sm"
          type="password"
          {...register("password")}
        />
        {errors.password ? (
          <p className="mt-1 text-sm text-red-300">{errors.password.message}</p>
        ) : null}
      </label>

      <label className="block">
        <span className="text-sm font-bold text-zinc-300">
          {auth("confirmPassword")}
        </span>
        <input
          className="auto-input mt-2 w-full rounded-md px-3 py-2 text-sm"
          type="password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword ? (
          <p className="mt-1 text-sm text-red-300">
            {errors.confirmPassword.message}
          </p>
        ) : null}
      </label>

      {error ? (
        <div className="rounded-md border border-red-400/30 bg-red-950/40 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <button className="btn-primary w-full" disabled={isLoading} type="submit">
        {isLoading ? auth("creatingAccount") : common("register")}
      </button>

      <div className="grid grid-cols-2 gap-3">
        <button
          className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-bold text-zinc-300"
          type="button"
        >
          {common("google")}
        </button>
        <button
          className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-bold text-zinc-300"
          type="button"
        >
          {common("apple")}
        </button>
      </div>

      <p className="text-center text-sm text-zinc-400">
        {auth("hasAccount")}{" "}
        <Link className="font-semibold text-red-300" href="/login">
          {common("login")}
        </Link>
      </p>
    </form>
  );
}
