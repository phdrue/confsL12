import { JSX } from "react";
import RegularTextBlockFormComponent from "@/components/forms/blocks/regular-text";
import LinksTextBlockFormComponent from "@/components/forms/blocks/links";
import ListTextBlockFormComponent from "@/components/forms/blocks/list";
import KeyValueTextBlockFormComponent from "@/components/forms/blocks/key-value";
import HeadingTextBlockFormComponent from "@/components/forms/blocks/heading";
import DisclamerTextBlockFormComponent from "@/components/forms/blocks/disclamer";
import SeparatorBlockFormComponent from "@/components/forms/blocks/separator";
import { Image, ImageCategory } from "@/types/blocks";
import ImagesBlockFormComponent from "@/components/forms/blocks/images";
// import ButtonsBlockFormComponent from "@/Components/Forms/Blocks/Buttons";

export default function RenderBlockForm({
    blockTypeId,
    content,
    setData,
    errors,
    imagesBlockData
}: {
    blockTypeId: number,
    content: any,
    setData: any,
    errors: any,
    imagesBlockData: {
        images: Array<Image>,
        imageCategories: Array<ImageCategory>
    }
}): JSX.Element | null {
    switch (blockTypeId) {
        case 1:
            return <RegularTextBlockFormComponent content={content} setData={setData} errors={errors} />
        case 2:
            return <ListTextBlockFormComponent content={content} setData={setData} errors={errors} />
        case 3:
            return <LinksTextBlockFormComponent content={content} setData={setData} errors={errors} />
        case 4:
            return <KeyValueTextBlockFormComponent content={content} setData={setData} errors={errors} />
        case 5:
            return <HeadingTextBlockFormComponent content={content} setData={setData} errors={errors} />
        case 6:
            return <DisclamerTextBlockFormComponent content={content} setData={setData} errors={errors} />
        case 7:
            return <SeparatorBlockFormComponent content={content} setData={setData} errors={errors} />
        // case 8:
        //     return <ButtonsBlockFormComponent content={content} setData={setData} errors={errors} />
        case 9:
            return <ImagesBlockFormComponent imagesBlockData={imagesBlockData} content={content} setData={setData} errors={errors} />
        default:
            return null;
    }
}
