import { Conference, ConferenceState, ConferenceType } from "@/types/conferences"
import { DataTableSelectFilter } from "@/types/other"
import { Star } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { ConferenceTypeBadge, ConferenceStateBadge } from "@/components/conferences/utils"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from "@inertiajs/react"

const columns: ColumnDef<Conference>[] = [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-2 font-semibold">
                    {row.getValue("id")}
                </div>
            )
        }
    },
    {
        accessorKey: "front_page",
        header: "FP",
        cell: ({ row }) => {
            return row.getValue("front_page") ? <Star className="fill-amber-300" size={16} /> : ""
        }
    },
    {
        accessorKey: "state_id",
        header: "Статус",
        filterFn: 'equalsString',
        cell: ({ row }) => {
            return <ConferenceStateBadge state_id={row.getValue("state_id")} />
        }
    },
    {
        accessorKey: "type_id",
        header: "Тип",
        filterFn: 'equalsString',
        cell: ({ row }) => {
            return <ConferenceTypeBadge type_id={row.getValue("type_id")} />
        }
    },
    {
        accessorKey: "name",
        header: "Название",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const conference = row.original
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Открыть меню</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Действия</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href={route('adm.conferences.show', conference.id)}>
                                Блоки
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={route('adm.conferences.edit', conference.id)}>
                                Изменить
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

export default function ConferencesAdminDataTable({
    conferences,
    states,
    types
}: {
    conferences: Array<Conference>,
    states: Array<ConferenceState>,
    types: Array<ConferenceType>,
}) {
    const filters: Array<DataTableSelectFilter> = [
        {
            name: 'type_id',
            selectLabel: "Типы",
            selectPlaceholder: "Фильтр типа",
            options: types
        },
        {
            name: 'state_id',
            selectLabel: "Статусы",
            selectPlaceholder: "Фильтр статуса",
            options: states
        },
    ]

    return <DataTable columns={columns} data={conferences} selectFilters={filters} />
}
