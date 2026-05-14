import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your Car Tuning Shop account.",
};

export default function LoginPage() {
  return (
    <PageHeader
      eyebrow="Account"
      title="Login"
      description="Authentication form and JWT session handling will be implemented here."
    />
  );
}
