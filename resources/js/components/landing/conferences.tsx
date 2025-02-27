import { Conference } from '@/types/conferences'
import { ConferenceCard } from '@/components/conferences/card'
import * as motion from "motion/react-client"
import { Link } from '@inertiajs/react'
import { Button } from "@/components/ui/button"

export default function Conferences({
    conferences
}: {
    conferences: Array<Conference>
}) {
    return (
        <motion.section
            initial={{ translateY: 120, opacity: 0 }}
            whileInView={{ translateY: 0, opacity: 1 }}
            transition={{
                delay: 0.2,
                duration: 0.8,
                ease: "easeInOut",
            }}
            viewport={{ once: true }}
            className="max-w-screen-xl mx-auto py-20">
            <div>
                <div className="max-w-2xl mx-auto px-4 sm:px-6">
                    <h2 className="text-center text-3xl sm:text-4xl font-semibold">Наши <span className="relative inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-brand-red">
                        <span className="relative text-white dark:text-gray-950">флагманские</span>
                    </span> конференции</h2>
                    <p className="text-brand-textSecondary text-center mt-6">Наиболее актуальные и интересные конференции, проводимые Курским Государственным Медицинским Университетом</p>
                </div>
                <div className="px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-12 mt-12">
                    {conferences.map((conference) => (
                        <ConferenceCard key={conference.name} conference={conference} />
                    ))}
                </div>
                <div className="flex w-full justify-center mt-12">
                    <Button variant="brandDarkBlue" size="buttonLink" asChild>
                        <Link href={route('conferences.index')}>Все мероприятия</Link>
                    </Button>
                </div>
            </div>
        </motion.section>
    )
}