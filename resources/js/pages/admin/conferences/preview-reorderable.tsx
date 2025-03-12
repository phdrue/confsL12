import { useForm } from "@inertiajs/react";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/Layouts/AdminLayout"
import { RenderBlock } from "@/Components/Utils/Blocks";
import { PreviewItem } from "@/Components/Utils/PreviewItem";
import CreateConferenceBlockForm from "@/Components/Forms/CreateConferenceBlockForm";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { type BreadcrumbItem } from "@/types"
import { Conference } from "@/types/conferences"
import { ConferenceBlock as ConferenceBlockType } from "@/types/blocks"
import { Reorder } from "framer-motion"

import { GripVertical, Pencil, Loader2 } from "lucide-react";

export default function PreviewReorderComponent({
    handleReorder,
    conferenceId,
    blocks,
    setBlocks,
    blockTypes
}: {
    handleReorder: (values: Array<ConferenceBlock>) => void,
    conferenceId: number,
    blocks: Array<ConferenceBlock>,
    setBlocks: (blocks: Array<ConferenceBlock>) => void,
    blockTypes: Array<ConferenceBlockType>
}) {
    const { data, setData, put, processing, transform } = useForm({
        blocks: '',
    })
    transform((data) => ({
        ...data,
        blocks: Array.from(blocks, (block) => {
            return {
                id: block.id,
                position: block.position,
            }
        }),
    }))
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    const { toast } = useToast()

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        put(route('adm.blocks.reorder', conferenceId), {
            onSuccess: () => {
                handleClose()
                toast({
                    variant: "success",
                    title: "Порядок блоков был сохранен!",
                })
            }
        })
    }

    return (
        <Card className="">
            <CardHeader className="">
                <CardTitle className="text-xl">Структура конференции</CardTitle>
            </CardHeader>
            <CardContent>
                <Reorder.Group
                    axis="y"
                    className="space-y-2"
                    values={blocks}
                    onReorder={handleReorder}
                >
                    {blocks.map((block) => (
                        <PreviewItem key={block.id} block={block} toast={toast} />
                    ))}
                </Reorder.Group>
            </CardContent>
            <CardFooter className="flex justify-between">
                <CreateConferenceBlockForm conferenceId={conferenceId} blockTypes={blockTypes} />
                <form onSubmit={submit}>
                    <Button disabled={processing} variant="brandCyan" type="submit">{processing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Сохраняю...
                        </>
                    ) : (
                        "Сохранить"
                    )}</Button>
                </form>
            </CardFooter>
        </Card >
    )
}