import { ConferenceBlock } from "@/types/blocks"
import { Reorder, useDragControls } from "framer-motion"
import { GripVertical, Pencil, Trash2 } from "lucide-react"
import { useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { FormEventHandler } from "react"

export function PreviewItem({
    block,
    toast,
    setOpenEdit,
    setBlockToEdit
}: {
    block: ConferenceBlock,
    toast: any,
    setOpenEdit: (openEdit: boolean) => void,
    setBlockToEdit: (block: ConferenceBlock | null) => void
}) {
    const controls = useDragControls()

    const { delete: destroy, processing, errors } = useForm({})

    const handleDeleteSubmit: FormEventHandler = (e) => {
        e.preventDefault()
        destroy(route('adm.blocks.destroy', block.id), {
            onBefore: () => confirm("Вы уверены, что хотите удалить?"),
            onSuccess: () => {
                toast({
                    variant: "success",
                    title: "Блок конференции удален!",
                })
            }
        })
    }

    return (
        <Reorder.Item
            value={block}
            dragListener={false}
            dragControls={controls}
            className="bg-white py-1.5 pl-2 pr-2 border-border select-none border rounded-md flex gap-8 justify-between items-center"
        >
            <span className="flex gap-2 items-center">
                <GripVertical size={20} className="cursor-grab active:cursor-grabbing touch-none text-black/70 shrink-0" onPointerDown={(e) => controls.start(e)} />
                {block.name}
            </span>
            <div className="flex gap-2">
                <Button onClick={() => { setOpenEdit(true); setBlockToEdit(block) }} type="button" variant={"outline"} size={"iconSmall"}>
                    <Pencil size={12} className="text-black/50" />
                </Button>
                <form onSubmit={handleDeleteSubmit}>
                    <Button type="submit" variant={"outline"} className="group" size={"iconSmall"}>
                        <Trash2 size={12} className="text-black/50 group-hover:text-rose-600" />
                    </Button>
                </form>
            </div>
        </Reorder.Item>
    )   
}
