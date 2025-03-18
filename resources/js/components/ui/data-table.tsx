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
}

export function DataTable<TData, TValue>({
    columns,
    data,
    filters,
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )

    const [sorting, setSorting] = React.useState<SortingState>([])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        initialState: {
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
        <div>
            <div className="flex items-center flex-wrap gap-4 py-4">
                {filters &&
                    <>
                        {filters.map((filter) =>
                            <div key={filter.name}>
                                {filter.type === "text" ?
                                    <Input
                                        placeholder={filter.data.placeholder}
                                        value={(table.getColumn(filter.name)?.getFilterValue() as string) ?? ""}
                                        onChange={(event) =>
                                            table.getColumn(filter.name)?.setFilterValue(event.target.value)
                                        }
                                        className="max-w-sm"
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
                        <Button variant={"outline"} onClick={() => table.resetColumnFilters()}>
                            Очистить
                        </Button>
                    </>
                }
            </div>
            <div className="rounded-md border">
                <Table>
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
            <div className="flex items-center justify-end space-x-2 py-4">
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
        </div >
    )
}
