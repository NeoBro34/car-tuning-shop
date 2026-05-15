"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { AdminDataTable } from "@/features/admin/components/admin-data-table";
import {
  getAdminOrders,
  updateAdminOrderStatus,
} from "@/features/admin/admin.service";
import { formatCartPrice } from "@/features/cart/cart-format";
import type { Order, OrderStatus } from "@/types/order";

const statuses: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export function AdminOrdersPage() {
  const admin = useTranslations("Admin");
  const common = useTranslations("Common");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  async function loadOrders() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAdminOrders(50, 0);

      setOrders(response.items);
    } catch {
      setError(admin("ordersError"));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateStatus(order: Order, status: OrderStatus) {
    const previous = orders;
    setOrders((current) =>
      current.map((item) => (item.id === order.id ? { ...item, status } : item)),
    );

    try {
      const updated = await updateAdminOrderStatus(order.id, { status });
      setOrders((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      setSelectedOrder((current) =>
        current?.id === updated.id ? updated : current,
      );
      toast.success(admin("statusUpdated"));
    } catch {
      setOrders(previous);
      toast.error(admin("statusError"));
    }
  }

  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      { accessorKey: "id", header: admin("order") },
      { accessorKey: "customer_name", header: admin("customer") },
      {
        header: common("total"),
        cell: ({ row }) => formatCartPrice(row.original.total_price),
      },
      {
        header: admin("status"),
        cell: ({ row }) => (
          <Select
            onChange={(event) =>
              updateStatus(row.original, event.target.value as OrderStatus)
            }
            value={row.original.status}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        ),
      },
      {
        header: admin("created"),
        cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
      },
      {
        header: common("actions"),
        cell: ({ row }) => (
          <Button
            onClick={() => setSelectedOrder(row.original)}
            type="button"
            variant="secondary"
          >
            {admin("detail")}
          </Button>
        ),
      },
    ],
    [orders],
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-black text-white">{admin("orders")}</h2>
        </CardHeader>
        <CardContent>
          {isLoading ? <div className="h-64 animate-pulse rounded-md bg-white/10" /> : null}
          {!isLoading && error ? (
            <div className="rounded-md border border-red-400/30 bg-red-950/40 p-4 text-red-200">
              {error}
            </div>
          ) : null}
          {!isLoading && !error ? (
            <AdminDataTable columns={columns} data={orders} emptyLabel={admin("noOrders")} />
          ) : null}
        </CardContent>
      </Card>

      {selectedOrder ? (
        <Card>
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-black text-white">
              {admin("order")} #{selectedOrder.id}
            </h2>
            <Button
              onClick={() => setSelectedOrder(null)}
              type="button"
              variant="ghost"
            >
              {common("close")}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-zinc-300">
            <div className="grid gap-3 sm:grid-cols-2">
              <p>
                <span className="font-bold">{admin("customer")}:</span>{" "}
                {selectedOrder.customer_name}
              </p>
              <p>
                <span className="font-bold">{common("phoneNumber")}:</span>{" "}
                {selectedOrder.phone_number}
              </p>
              <p className="sm:col-span-2">
                <span className="font-bold">{common("address")}:</span> {selectedOrder.address}
              </p>
              <p>
                <span className="font-bold">{admin("status")}:</span> {selectedOrder.status}
              </p>
              <p>
                <span className="font-bold">{common("total")}:</span>{" "}
                {formatCartPrice(selectedOrder.total_price)}
              </p>
            </div>
            <div className="rounded-md border border-white/10">
              {selectedOrder.items.map((item) => (
                <div
                  className="flex justify-between gap-4 border-b border-white/10 p-3 last:border-b-0"
                  key={item.id}
                >
                  <span>{common("product")} #{item.product_id} x {item.quantity}</span>
                  <span className="font-bold">{formatCartPrice(item.subtotal)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
