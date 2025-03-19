import { Image, ImageCategory } from "@/types/blocks"

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
    return (
        <p>adfasdf</p>
    )
}