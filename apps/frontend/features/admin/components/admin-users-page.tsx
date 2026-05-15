"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AdminDataTable } from "@/features/admin/components/admin-data-table";
import {
  blockAdminUser,
  getAdminUsers,
  unblockAdminUser,
} from "@/features/admin/admin.service";
import type { User } from "@/features/auth";

export function AdminUsersPage() {
  const admin = useTranslations("Admin");
  const common = useTranslations("Common");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  async function loadUsers() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAdminUsers(50, 0);

      setUsers(response.items);
    } catch {
      setError(admin("usersError"));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function toggleUser(user: User) {
    const nextActive = !user.is_active;
    const previous = users;
    setUsers((current) =>
      current.map((item) =>
        item.id === user.id ? { ...item, is_active: nextActive } : item,
      ),
    );

    try {
      const updated = user.is_active
        ? await blockAdminUser(user.id)
        : await unblockAdminUser(user.id);
      setUsers((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      toast.success(user.is_active ? admin("userBlocked") : admin("userUnblocked"));
    } catch {
      setUsers(previous);
      toast.error(admin("userStatusError"));
    }
  }

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "email", header: common("email") },
      { accessorKey: "full_name", header: common("name") },
      { accessorKey: "role", header: admin("role") },
      {
        header: admin("status"),
        cell: ({ row }) => (row.original.is_active ? admin("active") : admin("blocked")),
      },
      {
        header: common("actions"),
        cell: ({ row }) => (
          <Button
            onClick={() => toggleUser(row.original)}
            type="button"
            variant={row.original.is_active ? "danger" : "secondary"}
          >
            {row.original.is_active ? admin("block") : admin("unblock")}
          </Button>
        ),
      },
    ],
    [users],
  );

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-black text-white">{admin("users")}</h2>
      </CardHeader>
      <CardContent>
        {isLoading ? <div className="h-64 animate-pulse rounded-md bg-white/10" /> : null}
        {!isLoading && error ? (
          <div className="rounded-md border border-red-400/30 bg-red-950/40 p-4 text-red-200">
            {error}
          </div>
        ) : null}
        {!isLoading && !error ? (
          <AdminDataTable columns={columns} data={users} emptyLabel={admin("noUsers")} />
        ) : null}
      </CardContent>
    </Card>
  );
}
