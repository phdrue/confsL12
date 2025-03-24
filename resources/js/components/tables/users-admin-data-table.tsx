import { Conference, ConferenceState, ConferenceType, Proposal } from "@/types/conferences"
import { DataTableFilter } from "@/types/other"
import { Star, ArrowUpDown } from "lucide-react"
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
import { parseDateString } from "@/parse-date-string"
import { User } from "@/types"
import { cn } from "@/lib/utils"
import { Badge } from "../ui/badge"

const columns: ColumnDef<User>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "email",
        header: "email",
        cell: ({ row }) => {
            return (
                <div className={cn({ 'text-amber-500': row.original.email.includes('@kursksmu.net') })}>
                    {row.original.email}
                </div>
            )
        }
    },
    {
        id: "roles",
        header: "Роли",
        cell: ({ row }) => {
            return (
                <div className="flex items-center flex-wrap gap-2">
                    {row.original.roles && row.original.roles.map((role, index) => (
                        <Badge key={index} variant={"outline"}>{role.name}</Badge>
                    ))}
                </div>
            )
        },
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
                            <Link href={route('adm.conferences.participations', conference.id)}>
                                Участники
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={route('adm.conferences.show', conference.id)}>
                                Блоки
                            </Link>
                        </DropdownMenuItem>
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

export default function UsersAdminDataTable({
    users,
}: {
    users: Array<User>,
}) {

    return <DataTable columns={columns} data={users} />
}
