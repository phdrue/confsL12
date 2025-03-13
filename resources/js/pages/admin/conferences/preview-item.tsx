import { ConferenceBlock } from "@/types/blocks"
import { Reorder, useDragControls } from "framer-motion"
import { GripVertical, Pencil, Trash2 } from "lucide-react"
import { useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export function PreviewItem({ block, toast }: { block: ConferenceBlock, toast: any }) {
    const controls = useDragControls()

    const { delete: destroy, processing, errors } = useForm({})

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        destroy(route('adm.blocks.destroy', block.id), {
            onBefore: () => confirm("Вы уверены, что хотите удалить?"),
            onSuccess: () => {
                // handleClose()
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
                <Button type="button" variant={"outline"} size={"iconSmall"}>
                    <Pencil size={12} className="text-black/50" />
                </Button>
                <form onSubmit={submit}>
                    <Button type="submit" variant={"outline"} className="group" size={"iconSmall"}>
                        <Trash2 size={12} className="text-black/50 group-hover:text-rose-600" />
                    </Button>
                </form>
            </div>
        </Reorder.Item>
    )
}

export function PreviewItemDialog({ block, open, setOpen }: { block?: ConferenceBlock, open: boolean, setOpen: (open: boolean) => void }) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Создание конфедеренции</DialogTitle>
                </DialogHeader>
                <div className="w-full mx-auto py-32">

                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Закрыть
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
