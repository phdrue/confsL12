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
import { User } from "@/types"
import { useToast } from "@/hooks/use-toast"

export default function ParticipationsAdminDataTable({
    conference,
    participants,
}: {
    conference: Conference,
    participants: Array<User>,
}) {
    const { toast } = useToast()

    const { post, processing } = useForm({
        _method: 'put'
    })

    const columns: ColumnDef<User>[] = [
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
        {
            header: "Участие подтверждено",
            cell: ({ row }) => {
                return <ConferenceParticipationBadge confirmed={Boolean(row.original.pivot?.confirmed)} />
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
                                <Settings className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Действия</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => submit(row.original.id)} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Переключить присутствие
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const submit = (userId: number) => {
        post(route('adm.conferences.toggle-confirmed', [conference.id, userId]), {
            onBefore: () => confirm("Вы уверены, что хотите переключить присутствие?"),
            onSuccess: () => {
                toast({
                    variant: "success",
                    title: "Присутствие переключено!",
                })
            }
        })
    }

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
