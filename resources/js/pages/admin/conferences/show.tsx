import { type BreadcrumbItem } from "@/types"
import { useState, useEffect, useRef, useCallback } from "react";
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
    const [highlightedBlockId, setHighlightedBlockId] = useState<number | null>(null);
    const [blockToEdit, setBlockToEdit] = useState<ConferenceBlock | null>(null);
    const [openEdit, setOpenEdit] = useState(false);
    const blockRefs = useRef<Map<number, HTMLDivElement>>(new Map());

    const handleReorder = useCallback((values: Array<ConferenceBlock>): void => {
        const newValues = values.map((block, index) => ({
            ...block,
            position: index + 1
        }))
        setBlocks(newValues)
    }, []);

    useEffect(() => {
        setBlocks(defaultBlocks)
    }, [defaultBlocks])

    const handleHighlightBlock = useCallback((blockId: number) => {
        setHighlightedBlockId(blockId);
        const blockElement = blockRefs.current.get(blockId);
        if (blockElement) {
            blockElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        // Remove highlight after 2 seconds
        setTimeout(() => {
            setHighlightedBlockId(null);
        }, 2000);
    }, []);

    const handleBlockClick = useCallback((block: ConferenceBlock) => {
        setBlockToEdit(block);
        setOpenEdit(true);
    }, []);

    const registerBlockRef = useCallback((blockId: number, ref: HTMLDivElement | null) => {
        if (ref) {
            blockRefs.current.set(blockId, ref);
        } else {
            blockRefs.current.delete(blockId);
        }
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Администрирование" />
            <div className="">
                <div className="flex flex-col-reverse xl:flex-row gap-8 p-4">
                    <div className="xl:max-w-[936px] flex flex-col grow items-center gap-12">
                        <ShowConference 
                            conference={conference} 
                            blocks={blocks}
                            isEditable={true}
                            highlightedBlockId={highlightedBlockId}
                            onBlockClick={handleBlockClick}
                            registerBlockRef={registerBlockRef}
                        />
                    </div>
                    <div className="">
                        <PreviewReorderComponent
                            handleReorder={handleReorder}
                            conferenceId={conference.id}
                            blocks={blocks}
                            blockTypes={blockTypes}
                            imagesBlockData={imagesBlockData}
                            onHighlightBlock={handleHighlightBlock}
                            blockToEdit={blockToEdit}
                            setBlockToEdit={setBlockToEdit}
                            openEdit={openEdit}
                            setOpenEdit={setOpenEdit}
                        />
                    </div>
                </div>
            </div>
        </AppLayout >
    )
}

