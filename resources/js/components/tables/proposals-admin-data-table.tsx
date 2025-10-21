import { Conference, ConferenceState, ConferenceType, Proposal } from "@/types/conferences"
import { DataTableFilter } from "@/types/other"
import { Star, ArrowUpDown, Eye } from "lucide-react"
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Link } from "@inertiajs/react"
import { parseDateString } from "@/parse-date-string"
import { useState } from "react"

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
        header: "Краткое название",
        cell: ({ row }) => {
            return <div className="flex items-center gap-2 font-semibold">{row.original.payload.shortName}</div>
        }
    },
    {
        header: "Дата проведения",
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
        id: "actions",
        cell: ({ row }) => {
            const proposal = row.original
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
                            <ProposalPreviewDialog proposal={proposal} />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

export default function ProposalsAdminDataTable({
    proposals,
}: {
    proposals: Array<Proposal>,
}) {

    return <DataTable columns={columns} data={proposals} />
}
