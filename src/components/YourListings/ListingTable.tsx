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
import { format, set } from "date-fns";
import {
  ArrowUpDown,
  Github,
  ListFilter,
  SquareArrowOutUpRight,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { yourListingAction } from "@/actions";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";
import Link from "next/link";

type BountyData = {
  id: string;
  title: string;
  oneLiner: string;
  description: string;
  githubRepo: string;
  githubIssue: string;
  difficulty: string;
  rewardAmount: number;
  rewardToken: string;
  isLive: boolean;
  completed: boolean;
};

export default function ListingTable() {
  const session = useSession();
  const router = useRouter();

  const [data, setData] = useState<BountyData[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    const fetchUserQRs = async () => {
      const response = await yourListingAction(session?.data?.user.id);
      console.log(response);
      setData(response);
    };
    fetchUserQRs();
  }, []);

  const columns: ColumnDef<BountyData>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "title",
        header: ({ column }) => {
          return (
            <div className="flex items-center space-x-2">
              <span>Title</span>
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
        cell: ({ row }) => (
          <div className="capitalize">
            {(row.getValue("title") as string).length > 8
              ? (row.getValue("title") as string).substring(0, 8) + "..."
              : (row.getValue("title") as string)}
          </div>
        ),
      },
      {
        accessorKey: "isLive",
        header: "Is Live",
        cell: ({ row }) => {
          console.log(row.getValue("isLive"));
          return <div>{row.getValue("isLive") ? "Yes" : "No"}</div>;
        },
      },
      {
        header: "View Submissions",
        id: "edit",
        cell: (tableProps) => (
          <Button
            className="size-8 gap-2.5 rounded-md p-0 transition duration-500 hover:bg-accent dark:bg-accent dark:hover:bg-accent"
            onClick={() => {
              router.push(`/bounties/${tableProps.row.original.id}`);
            }}
            variant="link"
          >
            <SquareArrowOutUpRight size={18} />
          </Button>
        ),
      },

      {
        accessorKey: "rewardAmount",
        header: "Reward",
        cell: ({ row }) => {
          return (
            <div className="flex items-center space-x-1 text-black dark:text-white">
              <span>{row.getValue("rewardAmount")}</span>
              <Avatar className="size-5">
                <AvatarImage
                  src={
                    row.original.rewardToken === "USDC"
                      ? "https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694"
                      : "https://assets.coingecko.com/coins/images/4128/standard/solana.png?1718769756"
                  }
                />
                <AvatarFallback>
                  {row.original.rewardToken === "USDC" ? "USDC" : "SOL"}
                </AvatarFallback>
              </Avatar>
            </div>
          );
        },
      },
      {
        accessorKey: "completed",
        header: "Status",
        cell: ({ row }) => {
          return (
            <div
              className={cn(
                "text-titlebgdark w-[80px] rounded-full px-2 py-1 text-center font-medium dark:text-black",
                row.getValue("completed") === true
                  ? "bg-orange-100"
                  : "bg-green-200",
              )}
            >
              {row.getValue("completed") ? "Completed" : "In Progress"}
            </div>
          );
        },
      },
      {
        id: "github",
        header: "Github",
        cell: ({ row }) => {
          console.log(row.original.githubRepo);
          return (
            <Link
              className=""
              href={`https://github.com/${row.original.githubRepo}/issues/${row.original.githubIssue.split(" ")[0].replace("#", "")}`}
              target="_blank"
            >
              <span>
                <svg
                  fill="currentColor"
                  width="22"
                  height="22"
                  viewBox="0 0 64 64"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M32 1.7998C15 1.7998 1 15.5998 1 32.7998C1 46.3998 9.9 57.9998 22.3 62.1998C23.9 62.4998 24.4 61.4998 24.4 60.7998C24.4 60.0998 24.4 58.0998 24.3 55.3998C15.7 57.3998 13.9 51.1998 13.9 51.1998C12.5 47.6998 10.4 46.6998 10.4 46.6998C7.6 44.6998 10.5 44.6998 10.5 44.6998C13.6 44.7998 15.3 47.8998 15.3 47.8998C18 52.6998 22.6 51.2998 24.3 50.3998C24.6 48.3998 25.4 46.9998 26.3 46.1998C19.5 45.4998 12.2 42.7998 12.2 30.9998C12.2 27.5998 13.5 24.8998 15.4 22.7998C15.1 22.0998 14 18.8998 15.7 14.5998C15.7 14.5998 18.4 13.7998 24.3 17.7998C26.8 17.0998 29.4 16.6998 32.1 16.6998C34.8 16.6998 37.5 16.9998 39.9 17.7998C45.8 13.8998 48.4 14.5998 48.4 14.5998C50.1 18.7998 49.1 22.0998 48.7 22.7998C50.7 24.8998 51.9 27.6998 51.9 30.9998C51.9 42.7998 44.6 45.4998 37.8 46.1998C38.9 47.1998 39.9 49.1998 39.9 51.9998C39.9 56.1998 39.8 59.4998 39.8 60.4998C39.8 61.2998 40.4 62.1998 41.9 61.8998C54.1 57.7998 63 46.2998 63 32.5998C62.9 15.5998 49 1.7998 32 1.7998Z" />
                </svg>
              </span>
            </Link>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
          return (
            <div>
              {format(new Date(row.getValue("createdAt")), "dd MMM yyyy")}
            </div>
          );
        },
      },
      // {
      //   header: "Delete",
      //   id: "delete",

      //   cell: (tableProps) => (
      //     <Button
      //       className="size-8 gap-2.5 rounded-md p-0 transition duration-500 hover:bg-red-900 dark:bg-red-600 dark:hover:bg-red-900"
      //       onClick={async () => {
      //         const data = await deleteCouponAction(
      //           tableProps.row.original.title,
      //         );
      //         toast.success("Coupon deleted successfully");
      //         setData(data as any);
      //       }}
      //       variant="destructive"
      //     >
      //       <Trash2 size={18} />
      //     </Button>
      //   ),
      // },
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
          placeholder="Filter Your Listings..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
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
              <TableRow
                key={headerGroup.id}
                className="dark:hover:bg-hoverdark"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="whitespace-nowrap">
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
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="dark:hover:bg-hoverdark whitespace-nowrap border-b-[0.5px]"
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
                  className="dark:hover:bg-hoverdark h-24 text-center dark:bg-black"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
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
    </div>
  );
}
