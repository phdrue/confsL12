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
    const storageImageUrl = image ? `/files/${encodeURI(image.path)}` : null;

    return (
        <Dialog open={openPreview} onOpenChange={setOpenPreview}>
            <DialogContent className="max-w-full sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Просмотр изображения</DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                {image && storageImageUrl &&
                    <a href={storageImageUrl} target="_blank" rel="noopener noreferrer">
                        <img className="h-56 object-contain" src={storageImageUrl} alt={image.name} />
                    </a>
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