import { useForm } from "@inertiajs/react";
import { useToast } from "@/hooks/use-toast";
import { PreviewItem } from "@/pages/admin/conferences/preview-item";
import CreateConferenceBlockForm from "@/components/forms/blocks/create";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConferenceBlock, ConferenceBlockType, Image, ImageCategory } from "@/types/blocks"
import { Reorder } from "framer-motion"
import { FormEventHandler, useState } from "react";

import { LoaderCircle } from "lucide-react";

import { EditConferenceBlockForm } from "@/components/forms/blocks/edit";

export default function PreviewReorderComponent({
    handleReorder,
    conferenceId,
    blocks,
    blockTypes,
    imagesBlockData
}: {
    handleReorder: (values: Array<ConferenceBlock>) => void,
    conferenceId: number,
    blocks: Array<ConferenceBlock>,
    blockTypes: Array<ConferenceBlockType>,
    imagesBlockData: {
        images: Array<Image>,
        imageCategories: Array<ImageCategory>
    }
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

    const [openEdit, setOpenEdit] = useState(false);
    const handleCloseEdit = () => setOpenEdit(false);

    const [blockToEdit, setBlockToEdit] = useState<ConferenceBlock | null>(null);

    const { toast } = useToast()

    const handleReorderSubmit: FormEventHandler = (e) => {
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
                        <PreviewItem
                            key={block.id}
                            block={block}
                            toast={toast}
                            setOpenEdit={setOpenEdit}
                            setBlockToEdit={setBlockToEdit}
                        />
                    ))}
                </Reorder.Group>
            </CardContent>
            <CardFooter className="flex justify-between">
                <CreateConferenceBlockForm imagesBlockData={imagesBlockData} conferenceId={conferenceId} blockTypes={blockTypes} />
                <EditConferenceBlockForm toast={toast} imagesBlockData={imagesBlockData} block={blockToEdit} openEdit={openEdit} setOpenEdit={setOpenEdit} />
                <form onSubmit={handleReorderSubmit}>
                    <Button type="submit" className="w-full" tabIndex={4} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Сохранить
                    </Button>
                </form>
            </CardFooter>
        </Card >
    )
}
