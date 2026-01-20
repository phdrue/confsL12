import { DataTableFilter } from "@/types/other"
import { LoaderCircle } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useForm } from "@inertiajs/react"
import { User } from "@/types"
import { cn } from "@/lib/utils"
import { Badge } from "../ui/badge"
import { useToast } from "@/hooks/use-toast"

export default function UsersAdminDataTable({
    users,
}: {
    users: Array<User>,
}) {
    const { toast } = useToast()

    const { post, processing } = useForm({
        _method: 'put'
    })

    const submit = (userId: number) => {
        post(route('adm.users.toggle-responsible', userId), {
            onBefore: () => confirm("Вы уверены, что хотите переключить ответственность? Ответственности будут удалены"),
            onSuccess: () => {
                toast({
                    variant: "success",
                    title: "Роль переключена!",
                })
            }
        })
    }

    const filters: Array<DataTableFilter> = [
        {
            name: 'email',
            type: 'text',
            data: {
                placeholder: 'Фильтр по email...',
            },
        },
        {
            name: 'fullName',
            type: 'text',
            data: {
                placeholder: 'Фильтр по имени...',
            },
        },
    ]

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: "id",
            header: "ID",
        },
        {
            accessorKey: "email",
            header: "email",
            filterFn: 'includesString',
            cell: ({ row }) => {
                return (
                    <div className={cn({ 'text-amber-500': row.original.email.includes('@kursksmu.net') })}>
                        {row.original.email}
                    </div>
                )
            }
        },
        {
            id: "fullName",
            accessorFn: (row) => `${row.last_name ?? ""} ${row.first_name ?? ""} ${row.second_name ?? ""}`.split(" ").filter(Boolean).join(" "),
            header: "ФИО",
            filterFn: 'includesString',
            cell: ({ row }) => {
                return (
                    <>
                        {row.original.last_name} {row.original.first_name} {row.original.second_name}
                    </>
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
                            <DropdownMenuItem asChild>
                                <DropdownMenuItem onClick={() => submit(row.original.id)} disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Роль ответсвенного
                                </DropdownMenuItem>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    return <DataTable columns={columns} data={users} filters={filters} />
}
