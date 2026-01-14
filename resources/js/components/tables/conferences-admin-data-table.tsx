import { Conference, ConferenceState, ConferenceType } from "@/types/conferences"
import { DataTableFilter } from "@/types/other"
import { Star, ArrowUpDown, FileText } from "lucide-react"
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
import ProposalPreviewDialog from "@/components/proposals/proposal-preview-dialog"
import { Trash2 } from "lucide-react"
import { FormEventHandler } from "react"
import { useToast } from "@/hooks/use-toast"

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
        accessorKey: "date",
        sortingFn: (rowA, rowB, columnId) => {
            const dateA = parseDateString(rowA.getValue(columnId))
            const dateB = parseDateString(rowB.getValue(columnId))
            return dateA.getTime() - dateB.getTime()
        },
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Дата
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "name",
        header: "Название",
    },
    {
        header: "Предложение",
        cell: ({ row }) => {
            const conference = row.original;
            if (conference.proposal) {
                return (
                    <ProposalPreviewDialog 
                        proposal={conference.proposal}
                        trigger={
                            <Button variant="outline" size="sm">
                                <FileText className="w-4 h-4 mr-2" />
                                Просмотр
                            </Button>
                        }
                        title="Исходное предложение"
                    />
                );
            } else {
                return (
                    <span className="text-sm text-gray-400">—</span>
                );
            }
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return <ConferenceActionsCell conference={row.original} />
        },
    },
]

function ConferenceActionsCell({ conference }: { conference: Conference }) {
    const { toast } = useToast()
    const { delete: destroy, processing } = useForm({})

    const handleDelete: FormEventHandler = (e) => {
        e.preventDefault()
        if (confirm(`Вы уверены, что хотите удалить конференцию "${conference.name}"? Это действие нельзя отменить.`)) {
            destroy(route('adm.conferences.destroy', conference.id), {
                onSuccess: () => {
                    toast({
                        variant: "success",
                        title: "Конференция удалена!",
                    })
                },
                onError: () => {
                    toast({
                        variant: "destructive",
                        title: "Ошибка при удалении конференции",
                    })
                }
            })
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Открыть меню</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuLabel>Действия</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                    <Link href={route('adm.conferences.participations', conference.id)}>
                        Участники
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={route('adm.conferences.responsible', conference.id)}>
                        Ответственные
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
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                    onClick={handleDelete}
                    disabled={processing}
                    className="text-red-600 focus:text-red-600"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Удалить
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default function ConferencesAdminDataTable({
    conferences,
    states,
    types
}: {
    conferences: Array<Conference>,
    states: Array<ConferenceState>,
    types: Array<ConferenceType>,
}) {
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
        {
            name: 'state_id',
            type: 'select',
            data: {
                label: "Статус",
                options: states,
                placeholder: "Фильтр статуса"
            }
        },
    ]

    return <DataTable columns={columns} data={conferences} filters={filters} />
}
