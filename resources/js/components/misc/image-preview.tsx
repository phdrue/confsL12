import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Image } from "@/types/blocks";

export function ImagePreview({
    image,
    openPreview,
    setOpenPreview,
}: {
    image: Image | null,
    openPreview: boolean,
    setOpenPreview: (openPreview: boolean) => void,
}) {
    return (
        <Dialog open={openPreview} onOpenChange={setOpenPreview}>
            <DialogContent className="max-w-full sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Просмотр изображения</DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                {image &&
                    <img className="h-56" src={`/${image.path}`} alt={image.name} />
                }
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