import { Conference, ConferenceState, ConferenceType } from "@/types/conferences"
import { DataTableFilter, DataTableSelectFilter } from "@/types/other"
import { LoaderCircle, Star } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { ConferenceTypeBadge, ConferenceStateBadge, ConferenceParticipationBadge } from "@/components/conferences/utils"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link, useForm } from "@inertiajs/react"

export default function ConferencesClientDataTable({
    conferences,
}: {
    conferences: Array<Conference>,
}) {

    const download = (conferenceId: number) => {
        window.open(route('client.conferences.my-thesis', conferenceId))
    }

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
            header: "Участие подтверждено",
            cell: ({ row }) => {
                return <ConferenceParticipationBadge confirmed={Boolean(row.original.pivot?.confirmed)} />
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
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Открыть меню</span>
                                <Settings className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => download(row.original.id)}>
                                Выгрузить файлы
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
        }
    ]

    return <DataTable columns={columns} data={conferences} filters={filters} />
}
