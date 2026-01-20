import { Proposal } from "@/types/conferences"
import { DataTableFilter } from "@/types/other"
import { Auth } from "@/types"
import { ArrowUpDown, X, CheckCircle, ExternalLink } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { ConferenceTypeBadge, ConferenceStateBadge } from "@/components/conferences/utils"
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Link, usePage, router } from "@inertiajs/react"
import { parseDateString } from "@/parse-date-string"
import { useState } from "react"
import ProposalEditForm from "@/components/forms/proposals/edit"

// Confirmation Dialog for Deny Action
function DenyConfirmationDialog({ proposal }: { proposal: Proposal }) {
    const [open, setOpen] = useState(false);

    const handleDeny = () => {
        router.put(route('adm.proposals.deny', proposal.id), {}, {
            onSuccess: () => setOpen(false)
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem 
                    className="text-red-600"
                    onSelect={(e) => e.preventDefault()}
                >
                    <X className="w-4 h-4 mr-2" />
                    Отклонить
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Подтверждение отклонения</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-gray-600">
                        Вы уверены, что хотите отклонить предложение <strong>"{proposal.payload.shortName}"</strong>?
                    </p>
                    <p className="text-sm text-red-600 mt-2">
                        Это действие нельзя отменить.
                    </p>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Отмена
                    </Button>
                    <Button variant="destructive" onClick={handleDeny}>
                        Отклонить предложение
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// Confirmation Dialog for Approve Action
function ApproveConfirmationDialog({ proposal }: { proposal: Proposal }) {
    const [open, setOpen] = useState(false);

    const handleApprove = () => {
        router.put(route('adm.proposals.approve', proposal.id), {}, {
            onSuccess: () => setOpen(false)
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem 
                    className="text-green-600"
                    onSelect={(e) => e.preventDefault()}
                >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Одобрить и создать конференцию
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Подтверждение одобрения</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-gray-600">
                        Вы уверены, что хотите одобрить предложение <strong>"{proposal.payload.shortName}"</strong> и создать из него конференцию?
                    </p>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-900">Будет создана конференция:</p>
                        <ul className="text-sm text-blue-700 mt-1 space-y-1">
                            <li>• Название: {proposal.payload.name}</li>
                            <li>• Дата: {new Date(proposal.payload.date).toLocaleDateString()}</li>
                            <li>• Уровень: {proposal.payload.level}</li>
                        </ul>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Отмена
                    </Button>
                    <Button variant="default" onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
                        Одобрить и создать конференцию
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// Proposal Preview Dialog Component
function ProposalPreviewDialog({ proposal }: { proposal: Proposal }) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                    Просмотр
                </Button>
            </DialogTrigger>
                <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Предварительный просмотр предложения</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    {proposal.img_path && (
                        <div className="w-full max-w-md aspect-video bg-gray-100 rounded-md overflow-hidden">
                            <img 
                                className="w-full h-full object-cover" 
                                alt={proposal.payload.shortName}
                                src={`/storage/${proposal.img_path}`}
                            />
                        </div>
                    )}
                    <div className="grid gap-4">
                        <div>
                            <h3 className="font-semibold text-lg">Основная информация</h3>
                            <div className="space-y-2 mt-2">
                                <div>
                                    <span className="font-medium">Полное название (RUS):</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.name}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Краткое название (RUS):</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.shortName}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Название (ENG):</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.engName}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Краткое название (ENG):</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.engShortName}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Уровень:</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.level}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Форма проведения:</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.form}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Вид мероприятия:</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.type}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Язык конференции:</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.lang}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg">Даты и место</h3>
                            <div className="space-y-2 mt-2">
                                <div>
                                    <span className="font-medium">Дата начала:</span>
                                    <p className="text-sm text-gray-600">{new Date(proposal.payload.date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Дата окончания:</span>
                                    <p className="text-sm text-gray-600">{new Date(proposal.payload.endDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Место проведения:</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.place}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg">Организация</h3>
                            <div className="space-y-2 mt-2">
                                <div>
                                    <span className="font-medium">Кафедра:</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.department}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Организатор:</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.organization}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Соорганизаторы:</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.organizationOther}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg">Участники</h3>
                            <div className="space-y-2 mt-2">
                                <div>
                                    <span className="font-medium">Общее количество участников:</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.participationsTotal}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Иностранные участники:</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.participationsForeign}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Очно:</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.coverageInPerson}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Дистанционно:</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.coverageOnline}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Профессиональное сообщество:</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.coverageProfession}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg">Дополнительная информация</h3>
                            <div className="space-y-2 mt-2">
                                <div>
                                    <span className="font-medium">Формат сборника:</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.bookType}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Основные направления:</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.topics}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Бюджет:</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.budget}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Источники бюджета:</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.budgetSource}</p>
                                </div>
                            </div>
                        </div>

                        {proposal.payload.audiences && proposal.payload.audiences.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-lg">Целевая аудитория</h3>
                                <div className="mt-2">
                                    <ul className="list-disc list-inside space-y-1">
                                        {proposal.payload.audiences.map((audience, index) => (
                                            <li key={index} className="text-sm text-gray-600">{audience}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {proposal.payload.amenities && proposal.payload.amenities.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-lg">Дополнительные услуги</h3>
                                <div className="mt-2">
                                    <ul className="list-disc list-inside space-y-1">
                                        {proposal.payload.amenities.map((amenity, index) => (
                                            <li key={index} className="text-sm text-gray-600">{amenity}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default function ProposalsAdminDataTable({
    proposals,
}: {
    proposals: Array<Proposal>,
}) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const isAdmin = auth?.roles?.includes('Администратор') || false;

    const filters: Array<DataTableFilter> = [
        {
            name: 'shortName',
            type: 'text',
            data: {
                placeholder: 'Фильтр по названию...',
            },
        },
        {
            name: 'status',
            type: 'select',
            data: {
                label: 'Статус',
                placeholder: 'Фильтр статуса',
                options: [
                    { id: 'approved', name: 'Одобрено' },
                    { id: 'denied', name: 'Отклонено' },
                    { id: 'pending', name: 'Ожидает' },
                ],
            },
        },
    ]

    const columns: ColumnDef<Proposal>[] = [
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
            id: "shortName",
            accessorFn: (row) => row.payload.shortName,
            header: "Краткое название",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-2">
                        {row.original.img_path && (
                            <img 
                                src={`/storage/${row.original.img_path}`} 
                                alt={row.original.payload.shortName}
                                className="w-12 h-12 object-cover rounded-md"
                            />
                        )}
                        <span className="font-semibold">{row.original.payload.shortName}</span>
                    </div>
                )
            }
        },
        {
            id: "date",
            accessorFn: (row) => row.payload.date,
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
                        Дата проведения
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                return <div className="flex items-center gap-2 font-semibold">{new Date(row.original.payload.date).toLocaleDateString()}</div>
            }
        },
        {
            header: "Организатор",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-2 font-semibold">
                        {row.original.user.last_name} {row.original.user.first_name} {row.original.user.second_name}
                    </div>
                )
            }
        },
        {
            id: "status",
            accessorFn: (row) => {
                if (row.conference_id) {
                    return 'approved'
                }

                if (row.denied) {
                    return 'denied'
                }

                return 'pending'
            },
            filterFn: 'equalsString',
            header: "Статус",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                if (status === 'approved') {
                    return (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Одобрено
                        </span>
                    );
                } else if (status === 'denied') {
                    return (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <X className="w-3 h-3 mr-1" />
                            Отклонено
                        </span>
                    );
                } else {
                    return (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Ожидает
                        </span>
                    );
                }
            }
        },
        {
            header: "Конференция",
            cell: ({ row }) => {
                const proposal = row.original;
                if (proposal.conference_id) {
                    return (
                        <Link 
                            href={route('adm.conferences.edit', proposal.conference_id)}
                            className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                        >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Редактировать конференцию
                        </Link>
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
                const proposal = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Открыть меню</span>
                                <Settings className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuLabel>Действия</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <ProposalPreviewDialog proposal={proposal} />
                            </DropdownMenuItem>
                            {isAdmin && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <ProposalEditForm proposal={proposal} />
                                    </DropdownMenuItem>
                                    {!proposal.conference_id && !proposal.denied && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <ApproveConfirmationDialog proposal={proposal} />
                                            <DenyConfirmationDialog proposal={proposal} />
                                        </>
                                    )}
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    return <DataTable columns={columns} data={proposals} filters={filters} />
}
