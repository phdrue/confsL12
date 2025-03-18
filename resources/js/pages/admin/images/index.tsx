import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ImagesAdminDataTable from "@/components/tables/images-admin-data-table";
import { Image } from "@/types/blocks";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Администрирование',
        href: '/dashboard',
    },
];

export default function Index({
    images,
}: {
    images: Array<Image>,
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Администрирование" />
            <div className="space-y-10 max-w-screen-2xl pb-16 p-4 md:p-6">
                <div className="grid grid-cols-1 scroll-mt-20 items-start gap-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:gap-10">
                    <div className="md:col-span-2 lg:col-span-3">
                        {/* <Image /> */}
                        <ImagesAdminDataTable images={images} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
