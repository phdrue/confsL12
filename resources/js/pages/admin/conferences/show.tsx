import { type BreadcrumbItem } from "@/types"
import { useState, useEffect } from "react";
import { Conference } from "@/types/conferences"
import { ConferenceBlock, Image, ImageCategory } from "@/types/blocks";
import { Head } from '@inertiajs/react';
import AppLayout from "@/layouts/app-layout";
import ShowConference from '@/components/conferences/show';
import PreviewReorderComponent from "./preview-reorderable";
import { ConferenceBlock as ConferenceBlockType } from "@/types/blocks"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Администрирование',
        href: '/dashboard',
    },
];

export default function Show({
    conference,
    defaultBlocks,
    blockTypes,
    imagesBlockData
}: {
    conference: Conference,
    defaultBlocks: Array<ConferenceBlock>,
    blockTypes: Array<ConferenceBlockType>,
    imagesBlockData: {
        images: Array<Image>,
        imageCategories: Array<ImageCategory>
    }
}) {
    const [blocks, setBlocks] = useState<Array<ConferenceBlock>>(defaultBlocks);

    function handleReorder(values: Array<ConferenceBlock>): void {
        const newValues = values.map((block, index) => {
            return {
                ...block,
                position: index + 1
            }
        })
        setBlocks(newValues)
    }

    useEffect(() => {
        setBlocks(defaultBlocks)
    }, [defaultBlocks])

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Администрирование" />
            <div className="">
                <div className="flex flex-col-reverse xl:flex-row gap-8 p-4">
                    <div className="xl:max-w-[936px] flex flex-col grow items-center gap-12">
                        <ShowConference conference={conference} blocks={blocks} />
                    </div>
                    <div className="">
                        <PreviewReorderComponent
                            handleReorder={handleReorder}
                            conferenceId={conference.id}
                            blocks={blocks}
                            setBlocks={setBlocks}
                            blockTypes={blockTypes}
                            imagesBlockData={imagesBlockData}
                        />
                    </div>
                </div>
            </div>
        </AppLayout >
    )
}

