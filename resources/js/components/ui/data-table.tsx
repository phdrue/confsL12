"use client"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    ColumnDef,
    getSortedRowModel,
    SortingState,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DataTableFilter, DataTableSelectFilter } from "@/types/other"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    filters?: Array<DataTableFilter>
    onRowClick?: (row: TData) => void
    disablePagination?: boolean
}

export function DataTable<TData, TValue>({
    columns,
    data,
    filters,
    onRowClick,
    disablePagination = false,
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )

    const [sorting, setSorting] = React.useState<SortingState>([])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: disablePagination ? undefined : getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        initialState: disablePagination ? undefined : {
            pagination: {
                pageSize: 15,
            },
        },
        state: {
            sorting,
            columnFilters,
        },
    })

    return (
        <div className="w-full">
            <div className="flex flex-wrap items-stretch gap-2 py-4 sm:items-center sm:gap-4">
                {filters &&
                    <>
                        {filters.map((filter) =>
                            <div key={filter.name} className="w-full sm:w-auto">
                                {filter.type === "text" ?
                                    <Input
                                        placeholder={filter.data.placeholder}
                                        value={(table.getColumn(filter.name)?.getFilterValue() as string) ?? ""}
                                        onChange={(event) =>
                                            table.getColumn(filter.name)?.setFilterValue(event.target.value)
                                        }
                                        className="w-full sm:max-w-sm"
                                    /> : filter.type === "select" &&
                                    <Select name={filter.name} onValueChange={value => table.getColumn(filter.name)?.setFilterValue(value)}
                                        value={table.getColumn(filter.name)?.getFilterValue() as string ?? ""}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder={filter.data.placeholder} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>{filter.data.label}</SelectLabel>
                                                {filter.data.options.map((option) => (
                                                    <SelectItem key={option.id} value={String(option.id)}>{option.name}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                }
                            </div>)}
                        <Button variant={"outline"} className="w-full sm:w-auto" onClick={() => table.resetColumnFilters()}>
                            Очистить
                        </Button>
                    </>
                }
            </div>
            <div className="w-full rounded-md border">
                <Table className="min-w-full">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
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
                                    onClick={() => onRowClick?.(row.original)}
                                    className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Нет результатов
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {!disablePagination && (
                <div className="flex flex-wrap items-center justify-between gap-2 py-4 sm:justify-end">
                    <span className="text-sm">{table.getRowModel().rows.length} из {table.getPrePaginationRowModel().rows.length}</span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Назад
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Вперед
                    </Button>
                </div>
            )}
        </div >
    )
}
