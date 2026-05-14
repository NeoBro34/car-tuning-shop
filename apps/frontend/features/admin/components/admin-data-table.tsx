"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { Table, Td, Th } from "@/components/ui/table";

type AdminDataTableProps<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  emptyLabel: string;
};

export function AdminDataTable<T>({
  columns,
  data,
  emptyLabel,
}: AdminDataTableProps<T>) {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <Th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </Th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.length > 0 ? (
          table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <Td className="text-center text-zinc-500" colSpan={columns.length}>
              {emptyLabel}
            </Td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}
