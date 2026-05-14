import type { Metadata } from "next";
import { AuthCard } from "@/features/auth/components/auth-card";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a Car Tuning Shop account.",
};

export default function RegisterPage() {
  return (
    <AuthCard
      description="Create an account to save your cart and place orders."
      title="Register"
    >
      <RegisterForm />
    </AuthCard>
  );
}
