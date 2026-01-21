import { Conference, ConferenceType } from "@/types/conferences"
import { DataTableFilter } from "@/types/other"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { ConferenceTypeBadge } from "@/components/conferences/utils"
import { Settings, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from "@inertiajs/react"

export default function StarredConferencesDataTable({
    conferences,
    types,
}: {
    conferences: Array<Conference>,
    types: Array<ConferenceType>,
}) {
    const columns: ColumnDef<Conference>[] = [
        {
            id: "index",
            header: "#",
            cell: ({ row }) => {
                const index = row.index + 1
                return <div className="text-center font-medium">{index}</div>
            },
        },
        {
            accessorKey: "type_id",
            header: "Тип конференции",
            filterFn: 'equalsString',
            cell: ({ row }) => {
                return <ConferenceTypeBadge type_id={row.getValue("type_id")} />
            }
        },
        {
            accessorKey: "name",
            header: "Название",
            filterFn: 'includesString'
        },
        {
            accessorKey: "date",
            header: "Дата",
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Открыть меню</span>
                                <Settings className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={route('conferences.show', row.original.id)} target="_blank">
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Перейти к конференции
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const filters: Array<DataTableFilter> = [
        {
            name: 'name',
            type: 'text',
            data: {
                placeholder: 'Фильтр по названию...'
            }
        },
        {
            name: 'type_id',
            type: 'select',
            data: {
                label: "Тип",
                options: types,
                placeholder: "Фильтр типа"
            }
        },
    ]

    return <DataTable columns={columns} data={conferences} filters={filters} />
}
