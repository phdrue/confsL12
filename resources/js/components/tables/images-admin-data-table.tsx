import { Conference, ConferenceState, ConferenceType, Proposal } from "@/types/conferences"
import { DataTableFilter } from "@/types/other"
import { Star, ArrowUpDown } from "lucide-react"
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
import { Link } from "@inertiajs/react"
import { parseDateString } from "@/parse-date-string"
import { Image, ImageCategory } from "@/types/blocks"

export default function ImagesAdminDataTable({
    images,
    imageCategories,
    setOpenPreview,
    setImage
}: {
    images: Array<Image>,
    imageCategories: Array<ImageCategory>,
    setOpenPreview: (openPreview: boolean) => void,
    setImage: (image: Image) => void
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
            name: 'category_id',
            type: 'select',
            data: {
                label: "Тип",
                options: imageCategories,
                placeholder: "Фильтр категории"
            }
        },
    ]

    const columns: ColumnDef<Image>[] = [
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
            accessorKey: "default",
            header: "base",
            cell: ({ row }) => {
                return row.getValue("default") ? <Star className="fill-amber-300" size={16} /> : ""
            }
        },
        {
            accessorKey: "category_id",
            header: "Категория",
            filterFn: 'equalsString',
            cell: ({ row }) => {
                return row.original.category?.name
            }
        },
        {
            accessorKey: "name",
            header: "Название",
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const image = row.original
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
                            <DropdownMenuItem onClick={() => { setOpenPreview(true); setImage(image) }}>
                                Просмотр
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu >
                )
            },
        },
    ]


    return <DataTable columns={columns} data={images} filters={filters} />
}
