import { PartnersInfo, PartnersOff, PartnersStrat } from "@/components/landing/partners"
import ClientLayout from '@/layouts/client-layout';
import { Head } from '@inertiajs/react';
import Conferences from '@/components/landing/conferences';
import { Conference } from '@/types/conferences';
import Testimonial from "@/components/landing/testimonial";
import CTA from "@/components/landing/cta";
import Hero from "@/components/landing/hero"
import Features from "@/components/landing/features";

export default function Landing({
    conferences
}: {
    conferences: Array<Conference>
}) {
    return (
        <ClientLayout>
            <Head title="Главная страница" />
            <Hero />
            <PartnersStrat />
            <Features />
            <PartnersOff />
            <Conferences conferences={conferences} />
            <PartnersInfo />
            <Testimonial />
            <CTA />
        </ClientLayout>
    );
}
