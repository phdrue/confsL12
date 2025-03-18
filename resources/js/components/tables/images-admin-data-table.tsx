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
import { Image } from "@/types/blocks"

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
        accessorKey: "default",
        header: "base",
        cell: ({ row }) => {
            return row.getValue("default") ? <Star className="fill-amber-300" size={16} /> : ""
        }
    },
    {
        accessorKey: "name",
        header: "Название",
    },
]

export default function ImagesAdminDataTable({
    images,
}: {
    images: Array<Image>,
}) {

    return <DataTable columns={columns} data={images} />
}
