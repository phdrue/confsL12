import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { User } from "@/types"
import { Conference } from "@/types/conferences"
import { Degree, Title } from "@/types/other"
import { DataTableFilter } from "@/types/other"
import { ConferenceParticipationBadge } from "@/components/conferences/utils"
import { Settings, LoaderCircle, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useForm } from "@inertiajs/react"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { ParticipationDetailsDialog } from "./participation-details-dialog"

export default function AttendanceAdminDataTable({
    conference,
    participants,
    degrees,
    titles,
}: {
    conference: Conference,
    participants: Array<User>,
    degrees: Array<Degree>,
    titles: Array<Title>,
}) {
    const { toast } = useToast()
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)

    const { post, processing } = useForm({
        _method: 'put'
    })

    const submit = (userId: number) => {
        post(route('adm.conferences.toggle-confirmed', [conference.id, userId]), {
            onSuccess: () => {
                toast({
                    variant: "success",
                    title: "Присутствие переключено!",
                })
            }
        })
    }

    const handleRowClick = (user: User) => {
        if (!processing) {
            submit(user.id)
        }
    }
    const getDegreeName = (degreeId: number | null): string => {
        if (!degreeId) return ''
        const degree = degrees.find(d => d.id === degreeId)
        return degree?.name || ''
    }

    const getTitleName = (titleId: number | null): string => {
        if (!titleId) return ''
        const title = titles.find(t => t.id === titleId)
        return title?.name || ''
    }

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
            accessorKey: "last_name",
            header: "Фамилия",
            filterFn: 'includesString',
            cell: ({ row }) => {
                return <div>{row.original.last_name || ''}</div>
            },
        },
        {
            accessorKey: "first_name",
            header: "Имя",
            filterFn: 'includesString',
            cell: ({ row }) => {
                return <div>{row.original.first_name || ''}</div>
            },
        },
        {
            accessorKey: "second_name",
            header: "Отчество",
            filterFn: 'includesString',
            cell: ({ row }) => {
                return <div>{row.original.second_name || ''}</div>
            },
        },
        {
            accessorKey: "email",
            header: "Адрес электронной почты",
            filterFn: 'includesString',
            cell: ({ row }) => {
                return <div>{row.original.email || ''}</div>
            },
        },
        {
            id: "degree",
            header: "Ученая степень",
            cell: ({ row }) => {
                return <div>{getDegreeName(row.original.degree_id)}</div>
            },
        },
        {
            id: "title",
            header: "Ученое звание",
            cell: ({ row }) => {
                return <div>{getTitleName(row.original.title_id)}</div>
            },
        },
        {
            accessorKey: "phone",
            header: "Телефон",
            filterFn: 'includesString',
            cell: ({ row }) => {
                return <div>{row.original.phone || ''}</div>
            },
        },
        {
            header: "Участие подтверждено",
            cell: ({ row }) => {
                const user = row.original as User & {
                    participation?: { confirmed: boolean } | null
                }
                return <ConferenceParticipationBadge confirmed={Boolean(user.participation?.confirmed)} />
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="ghost" 
                                className="h-8 w-8 p-0"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <span className="sr-only">Открыть меню</span>
                                <Settings className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenuLabel>Действия</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedUser(row.original)
                                    setDialogOpen(true)
                                }}
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                Просмотреть данные
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const filters: Array<DataTableFilter> = [
        {
            name: 'last_name',
            type: 'text',
            data: {
                placeholder: 'Фильтр по фамилии...'
            }
        },
        {
            name: 'first_name',
            type: 'text',
            data: {
                placeholder: 'Фильтр по имени...'
            }
        },
        {
            name: 'email',
            type: 'text',
            data: {
                placeholder: 'Фильтр по электронной почте...'
            }
        },
        {
            name: 'phone',
            type: 'text',
            data: {
                placeholder: 'Фильтр по телефону...'
            }
        }
    ]

    return (
        <>
            <DataTable 
                columns={columns} 
                data={participants} 
                filters={filters}
                onRowClick={handleRowClick}
            />
            {selectedUser && (
                <ParticipationDetailsDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    user={selectedUser}
                    degrees={degrees}
                    titles={titles}
                />
            )}
        </>
    )
}
