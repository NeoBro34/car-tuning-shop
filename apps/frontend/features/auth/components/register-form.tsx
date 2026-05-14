"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/auth.schema";
import { useAuthStore } from "@/store/auth-store";

export function RegisterForm() {
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
      toast.success("Account created");
      router.replace("/products");
    } catch {
      toast.error("Registration failed");
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <label className="block">
        <span className="text-sm font-semibold text-zinc-700">Full name</span>
        <input
          className="mt-2 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
          type="text"
          {...register("full_name")}
        />
        {errors.full_name ? (
          <p className="mt-1 text-sm text-red-600">
            {errors.full_name.message}
          </p>
        ) : null}
      </label>

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

      <label className="block">
        <span className="text-sm font-semibold text-zinc-700">
          Confirm password
        </span>
        <input
          className="mt-2 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
          type="password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword ? (
          <p className="mt-1 text-sm text-red-600">
            {errors.confirmPassword.message}
          </p>
        ) : null}
      </label>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <button className="btn-primary w-full" disabled={isLoading} type="submit">
        {isLoading ? "Creating account..." : "Register"}
      </button>

      <p className="text-center text-sm text-zinc-600">
        Already have an account?{" "}
        <Link className="font-semibold text-red-600" href="/login">
          Login
        </Link>
      </p>
    </form>
  );
}
