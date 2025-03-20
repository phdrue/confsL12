import { Image, ImageCategory } from "@/types/blocks"
import { useState } from "react";
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { PlusIcon, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ImagesBlockFormComponent({
    content,
    setData,
    errors,
    imagesBlockData
}: {
    content: any,
    setData: any,
    errors: any,
    imagesBlockData: {
        images: Array<Image>,
        imageCategories: Array<ImageCategory>
    }
}) {
    const [categoryId, setCategoryId] = useState<string>('');
    const [imageId, setImageId] = useState<string>('');

    function addImageToContent() {
        if (imageId) {
            const image = imagesBlockData.images.find((image) => image.id === Number(imageId));
            const imageToAdd = {
                path: image?.default ? image?.path : `storage/${image?.path}`,
                name: image?.name
            }
            setData('content', {
                images: [
                    ...content.images, imageToAdd
                ]
            })
        }
    }

    function removeImageFromContent(imageToRemove: { path: string; name: string }) {
        const newContent = content.images.filter((image: { path: string; name: string }, index: number) => index !== content.images.indexOf(imageToRemove));
        setData('content', { images: newContent });
    }

    return (
        <>
            <Card>
                <CardHeader className="p-4">
                    <CardTitle className="text-base">Содержимое поля картинок</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2">
                    <div className="w-full space-y-1">
                        {content.images && content.images.map((image: { path: string, name: string }, index: number) => (
                            <div key={index} className="w-full flex grow gap-2 items-center justify-center">
                                <div className="flex grow">{image.name}</div>
                                <Button
                                    onClick={() => removeImageFromContent(image)}
                                    type="button"
                                    className="shrink-0 hover:text-red-600"
                                    variant={"outline"}
                                    size={"iconSmall"}>
                                    <Trash2 />
                                </Button>
                            </div>

                        ))}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="categoryId">Категория изображения</Label>
                        <Select name="categoryId" value={categoryId} onValueChange={(categoryId) => { setCategoryId(categoryId); setImageId('') }}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Выберите категорию" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Виды</SelectLabel>
                                    {imagesBlockData.imageCategories.map((category) => (
                                        <SelectItem key={category.id} value={String(category.id)}>{category.name}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.type_id} className="mt-2" />
                    </div>
                    {categoryId && (
                        <div className="space-y-2">
                            <div className="grid gap-2">
                                <Label htmlFor="image">Изображение</Label>
                                <Select name="image" value={imageId} onValueChange={(imageId) => setImageId(imageId)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Выберите изображение" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Изображения</SelectLabel>
                                            {imagesBlockData.images.filter((image) => image.category_id === Number(categoryId)).map((image) => (
                                                <SelectItem key={image.id} value={String(image.id)}>{image.name}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.type_id} className="mt-2" />
                            </div>
                            {imageId && (
                                <Button
                                    onClick={addImageToContent}
                                    type="button"
                                    variant={"outline"}>
                                    Добавить
                                </Button>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    )
}