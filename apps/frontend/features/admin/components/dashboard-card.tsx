import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type DashboardCardProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
};

export function DashboardCard({ icon: Icon, label, value }: DashboardCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-zinc-400">{label}</p>
          <p className="mt-2 text-3xl font-black text-white">{value}</p>
        </div>
        <div className="rounded-md bg-red-500/15 p-3 text-red-200">
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );
}
