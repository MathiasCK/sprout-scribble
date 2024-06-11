"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "./button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export default function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="rounded-md border">
      <Card>
        <CardHeader>
          <CardTitle>Your products</CardTitle>
          <CardDescription>
            Update, delete and edit your products💯
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Input
              placeholder="Filter products"
              value={
                (table.getColumn("title")?.getFilterValue() as string) ?? ""
              }
              onChange={e =>
                table.getColumn("title")?.setFilterValue(e.target.value)
              }
            />
          </div>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <CardFooter className="flex items-center justify-end gap-4 pt-4">
            <Button
              disabled={!table.getCanPreviousPage()}
              variant="outline"
              onClick={() => table.previousPage()}
            >
              <ChevronLeftIcon className="w-4 h-4" />
              <span>Go to previous page</span>
            </Button>
            <Button
              disabled={!table.getCanNextPage()}
              variant="outline"
              onClick={() => table.nextPage()}
            >
              <ChevronRightIcon className="w-4 h-4" />
              <span>Go to next page</span>
            </Button>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}
