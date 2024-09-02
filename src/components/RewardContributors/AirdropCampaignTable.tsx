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
import {
  ArrowUpDown,
  Check,
  Copy,
  ListFilter,
  SquareArrowOutUpRight,
} from "lucide-react";

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
import Link from "next/link";
import { shortenWalletAddress } from "@/lib/functions";
import { toast } from "sonner";
import SolanaExplorer from "../Common/SolanaExplorer";

type AirdropCampaignData = {
  id: string;
  airdropCampaignName: string;
  blinkLink: string | null;
  gitHubRepo: string;
  totalContributors: number;
  tokenMintAddress: string;
  totalAllocatedAmount: number;
  totalClaimedAmount: number | null;
  escrowAddress: string | null;
  eachContributorAmount: number;
  userId: string;
  noOfTimesClaimed: number | null;
};

export default function AirdropCampaignTable({
  airdrop,
}: {
  airdrop: AirdropCampaignData[];
}) {
  const [data, setData] = useState<AirdropCampaignData[]>(airdrop);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [copied, setCopied] = useState(false);

  const onCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Copied to clipboard");

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const columns: ColumnDef<AirdropCampaignData>[] = useMemo(
    () => [
      {
        id: "Airdrop Campaign Name",
        accessorKey: "airdropCampaignName",
        header: ({ column }) => (
          <div className="flex items-center space-x-2">
            <span>Campaign Name</span>
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
        ),
        cell: ({ row }) => <div>{row.getValue("airdropCampaignName")}</div>,
      },
      {
        id: "Blink",
        accessorKey: "blinkLink",
        header: "Blink",
        cell: ({ row }) => {
          return (
            <div className="flex items-center space-x-1">
              <span>
                {(row.getValue("blinkLink") as string).substring(0, 10) + "..."}
              </span>
              <Button
                onClick={() => {
                  onCopy(row.getValue("blinkLink") as string);
                }}
                disabled={copied}
                size="sm"
                className="rounded-full py-1"
              >
                {copied ? (
                  <Check className="size-3" />
                ) : (
                  <Copy className="size-3" />
                )}
              </Button>
            </div>
          );
        },
      },
      {
        id: "Github",
        accessorKey: "gitHubRepo",
        header: "Github",
        cell: ({ row }) => {
          return (
            <Link className="" href={row.original.gitHubRepo} target="_blank">
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
        id: "Total Contributors",
        accessorKey: "totalContributors",
        header: "Total Contributors",
        cell: ({ row }) => <div>{row.getValue("totalContributors")}</div>,
      },
      {
        id: "Total Allocated Amount",
        accessorKey: "totalAllocatedAmount",
        header: "Total Allocated",
        cell: ({ row }) => (
          <div>{Number(row.getValue("totalAllocatedAmount")).toFixed(2)}</div>
        ),
      },
      {
        id: "Each Contributor Amount",
        accessorKey: "eachContributorAmount",
        header: "Each Contributor Amount",
        cell: ({ row }) => (
          <div>{Number(row.getValue("eachContributorAmount")).toFixed(2)}</div>
        ),
      },
      {
        id: "Token Mint Address",
        accessorKey: "tokenMintAddress",
        header: "Token Mint Address",
        cell: ({ row }) => (
          <div className="flex items-center space-x-1">
            <span>
              {shortenWalletAddress(
                row.getValue("tokenMintAddress") as string,
                4,
              )}
            </span>
            <SolanaExplorer
              address={row.getValue("tokenMintAddress") as string}
            >
              <Button className="rounded-full py-1" size="sm">
                <SquareArrowOutUpRight className="size-3" />
              </Button>
            </SolanaExplorer>
          </div>
        ),
      },
      {
        id: "Escrow Address",
        accessorKey: "escrowAddress",
        header: "Escrow Address",
        cell: ({ row }) => (
          <div className="flex items-center space-x-1">
            <span>
              {shortenWalletAddress(row.getValue("escrowAddress") as string, 4)}
            </span>
            <SolanaExplorer address={row.getValue("escrowAddress") as string}>
              <Button className="rounded-full py-1" size="sm">
                <SquareArrowOutUpRight className="size-3" />
              </Button>
            </SolanaExplorer>
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
          placeholder="Filter Campaign Name..."
          value={
            (table
              .getColumn("airdropCampaignName")
              ?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table
              .getColumn("airdropCampaignName")
              ?.setFilterValue(event.target.value)
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
                  data-state={row.getIsSelected() && "selected"}
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
