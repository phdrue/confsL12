import { Conference, ConferenceState, ConferenceType } from "@/types/conferences"
import { DataTableFilter, DataTableSelectFilter } from "@/types/other"
import { Star } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { ConferenceTypeBadge, ConferenceStateBadge, ConferenceParticipationBadge } from "@/components/conferences/utils"
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
        accessorKey: "pivot.type_id",
        header: "Участие",
        filterFn: 'equals',
        cell: ({ row }) => {
            return <ConferenceParticipationBadge type_id={row.getValue("pivot_type_id")} />
        }
    },
    {
        accessorKey: "name",
        header: "Название",
        filterFn: 'includesString'
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

export default function ConferencesClientDataTable({
    conferences,
}: {
    conferences: Array<Conference>,
}) {
    const filters: Array<DataTableFilter> = [
        {
            name: 'name',
            type: 'text',
            data: {
                placeholder: 'Фильтр по названию...'
            }
        }
    ]

    return <DataTable columns={columns} data={conferences} filters={filters} />
}
