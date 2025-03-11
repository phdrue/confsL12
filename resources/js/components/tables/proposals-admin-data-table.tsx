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
]

export default function ProposalsAdminDataTable({
    proposals,
}: {
    proposals: Array<Proposal>,
}) {

    return <DataTable columns={columns} data={proposals} />
}
