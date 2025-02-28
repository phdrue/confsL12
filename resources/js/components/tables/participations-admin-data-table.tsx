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
import { User } from "@/types"

const columns: ColumnDef<Conference>[] = [
    {
        id: "index",
        header: "#",
        cell: ({ row }) => {
            const index = row.index + 1
            return <div className="text-left font-medium">{index}</div>
        },
    },
    {
        accessorKey: "email",
        header: "Адрес электронной почты",
        filterFn: 'includesString'
    },
    // {
    //     id: "actions",
    //     cell: ({ row }) => {
    //         const conference = row.original
    //         return (
    //             <DropdownMenu>
    //                 <DropdownMenuTrigger asChild>
    //                     <Button variant="ghost" className="h-8 w-8 p-0">
    //                         <span className="sr-only">Открыть меню</span>
    //                         <MoreHorizontal className="h-4 w-4" />
    //                     </Button>
    //                 </DropdownMenuTrigger>
    //                 <DropdownMenuContent align="end">
    //                     <DropdownMenuLabel>Действия</DropdownMenuLabel>
    //                     <DropdownMenuItem asChild>
    //                         <Link href={route('adm.conferences.show', conference.id)}>
    //                             Блоки
    //                         </Link>
    //                     </DropdownMenuItem>
    //                     <DropdownMenuSeparator />
    //                     <DropdownMenuItem asChild>
    //                         <Link href={route('adm.conferences.edit', conference.id)}>
    //                             Изменить
    //                         </Link>
    //                     </DropdownMenuItem>
    //                 </DropdownMenuContent>
    //             </DropdownMenu>
    //         )
    //     },
    // },
]

export default function ParticipationsAdminDataTable({
    participants,
}: {
    participants: Array<User>,
}) {
    const filters: Array<DataTableFilter> = [
        {
            name: 'email',
            type: 'text',
            data: {
                placeholder: 'Фильтр по электронной почте...'
            }
        }
    ]

    return <DataTable columns={columns} data={participants} filters={filters} />
}
