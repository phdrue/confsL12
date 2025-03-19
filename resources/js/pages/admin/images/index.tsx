import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ImagesAdminDataTable from "@/components/tables/images-admin-data-table";
import { Image, ImageCategory } from "@/types/blocks";
import { ImagePreview } from "@/components/misc/image-preview";
import { useState } from "react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Администрирование',
        href: '/dashboard',
    },
];
import { Button } from "@/components/ui/button";
import CreateImageForm from "@/components/forms/images/create";

export default function Index({
    images,
    imageCategories
}: {
    images: Array<Image>,
    imageCategories: Array<ImageCategory>
}) {
    const TableWithPreview = () => {
        const [image, setImage] = useState<Image | null>(null);
        const [openPreview, setOpenPreview] = useState(false);

        return (
            <>
                <ImagePreview image={image} openPreview={openPreview} setOpenPreview={setOpenPreview} />
                <ImagesAdminDataTable
                    images={images}
                    imageCategories={imageCategories}
                    setOpenPreview={setOpenPreview}
                    setImage={setImage}
                />
            </>
        )
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Администрирование" />
            <div className="space-y-10 max-w-screen-2xl pb-16 p-4 md:p-6">
                <div className="grid grid-cols-1 scroll-mt-20 items-start gap-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:gap-10">
                    <div className="md:col-span-2 lg:col-span-3">
                        {/* <Image /> */}
                        <CreateImageForm categories={imageCategories} />
                        <TableWithPreview />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
