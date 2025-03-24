import { Conference, ConferenceState, ConferenceType, Proposal } from "@/types/conferences"
import { DataTableFilter } from "@/types/other"
import { Star, ArrowUpDown, LoaderCircle } from "lucide-react"
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
import { Link, useForm } from "@inertiajs/react"
import { parseDateString } from "@/parse-date-string"
import { User } from "@/types"
import { cn } from "@/lib/utils"
import { Badge } from "../ui/badge"
import { useToast } from "@/hooks/use-toast"
import { FormEventHandler } from "react"

export default function ResponsibleAdminDataTable({
    conference,
    users,
}: {
    conference: Conference,
    users: Array<User>,
}) {
    const { toast } = useToast()

    const { post, processing } = useForm({
        _method: 'put'
    })

    const submit = (userId: number) => {
        post(route('adm.conferences.toggle-responsible', [conference.id, userId]), {
            onBefore: () => confirm("Вы уверены, что хотите удалить?"),
            onSuccess: () => {
                toast({
                    variant: "success",
                    title: "Ответственный удален!",
                })
            }
        })
    }

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
            id: "actions",
            cell: ({ row }) => {
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
                            <DropdownMenuItem onClick={() => submit(row.original.id)} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Удалить
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    return <DataTable columns={columns} data={users} />
}
