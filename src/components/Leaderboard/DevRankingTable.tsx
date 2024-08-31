"use client";

import { useState, useMemo, useEffect } from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ListFilter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAllDevRankings } from "@/actions";

type LeaderboardData = {
  rank: number;
  username: string;
  totalSubmissions: number | null;
  totalWins: number;
  totalEarnedInUSD: number;
};

export default function DevRankingTable() {
  const [data, setData] = useState<LeaderboardData[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      const response = await getAllDevRankings();

      setData(
        response.map((item, index) => ({
          rank: index + 1,
          username: item.user.name,
          totalSubmissions: item.totalSubmissions,
          totalWins: item.totalWins || 0,
          totalEarnedInUSD: item.totalEarnedInUSD || 0,
        })),
      );
    };
    fetchLeaderboardData();
  }, []);

  const columns: ColumnDef<LeaderboardData>[] = useMemo(
    () => [
      {
        accessorKey: "rank",
        header: ({ column }) => {
          return (
            <div className="flex items-center space-x-2">
              <span>Rank</span>
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="group px-3 py-1.5 text-start duration-300 dark:hover:bg-black dark:hover:text-white"
              >
                <ArrowUpDown className="h-4 w-4 transition-all duration-300 group-hover:rotate-180" />
              </Button>
            </div>
          );
        },
        cell: ({ row }) => <div>{row.getValue("rank")}</div>,
      },
      {
        accessorKey: "username",
        header: ({ column }) => {
          return (
            <div className="flex items-center space-x-2">
              <span>Username</span>
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="group px-3 py-1.5 text-start duration-300 dark:hover:bg-black dark:hover:text-white"
              >
                <ArrowUpDown className="h-4 w-4 transition-all duration-300 group-hover:rotate-180" />
              </Button>
            </div>
          );
        },
        cell: ({ row }) => <div>{row.getValue("username")}</div>,
      },
      {
        accessorKey: "totalSubmissions",
        header: "Total Submissions",
        cell: ({ row }) => <div>{row.getValue("totalSubmissions")}</div>,
      },
      {
        accessorKey: "totalWins",
        header: "Total Wins",
        cell: ({ row }) => <div>{row.getValue("totalWins")}</div>,
      },
      {
        accessorKey: "totalEarnedInUSD",
        header: "Total Earned (USD)",
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <span>
              {(row.getValue("totalEarnedInUSD") as number).toFixed(2)}
            </span>
            <Avatar className="size-5">
              <AvatarImage src="https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694" />
              <AvatarFallback>USDC</AvatarFallback>
            </Avatar>
          </div>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center pb-4 pl-1">
        <Input
          placeholder="Filter Username..."
          value={
            (table.getColumn("username")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          className="dark:hover:bg-hoverdark max-w-sm transition-all duration-500 dark:bg-black"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="dark:hover:bg-hoverdark group ml-auto transition-all duration-500 hover:bg-black hover:text-white dark:bg-black dark:text-white dark:hover:bg-accent"
            >
              Filter{" "}
              <ListFilter className="ml-2 h-4 w-4 transition-all duration-300 group-hover:scale-125" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="dark:bg-blacksection">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="dark:hover:bg-hoverdark capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="ml-1 rounded-md border">
        <Table className="dark:bg-blacksection rounded-md bg-white">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="whitespace-nowrap border-b-[0.5px]"
                >
                  {row.getVisibleCells().map((cell) => (
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
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
