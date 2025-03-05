import { Link } from "@inertiajs/react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { MoveRight } from "lucide-react";
import * as motion from "motion/react-client"

type Testimonial = {
    quote: string;
    name: string;
    designation: string;
    src: string;
};

const testimonials: Testimonial[] = [
    {
        quote: "Данная площадка, особенно в эру цифровизации, надеюсь станет полезным инструментом как для организаторов научных мероприятий, так и для их участников.",
        name: "Виктор Лазаренко",
        designation: "Ректор профессор КГМУ",
        src: "storage/img/landing/testimonials/1.webp",
    },
    {
        quote: "Данная площадка, особенно в эру цифровизации, надеюсь станет полезным инструментом как для организаторов научных мероприятий, так и для их участников.",
        name: "Вячеслав Липатов",
        designation: "Проректор по научной работе и инновационному развитию КГМУ",
        src: "storage/img/landing/testimonials/3.webp",
    },
    {
        quote: "Данная площадка, особенно в эру цифровизации, надеюсь станет полезным инструментом как для организаторов научных мероприятий, так и для их участников.",
        name: "Виктор Лазаренко",
        designation: "Operations Director at CloudScale",
        src: "storage/img/landing/testimonials/2.webp",
    },
];

export default function Testimonial() {
    return (
        <div className="py-20 w-full max-w-screen-xl mx-auto">
            <motion.div
                initial={{ translateY: 120, opacity: 0 }}
                whileInView={{ translateY: 0, opacity: 1 }}
                transition={{
                    delay: 0.2,
                    duration: 0.8,
                    ease: "easeInOut",
                }}
                viewport={{ once: true }}
                className="w-full">
                <div className="px-4 sm:px-6">
                    <h2 className="text-center text-3xl sm:text-4xl font-semibold">Слово от наших руководителей</h2>
                    <p className="text-brand-textSecondary text-center mt-2">
                        Какие блага получает участник научных мероприятий, принимая в них участие?
                    </p>
                </div>
                <div className="px-4 sm:px-6 mt-12">
                    <Carousel
                        opts={{
                            align: "start",
                            // loop: true,
                        }}
                    >
                        <CarouselContent className="mr-0">
                            <CarouselItem className="basis-auto md:basis-sm md:mr-8" key={0}>
                                <TestimonialCard testimonial={testimonials[0]} />
                            </CarouselItem>
                            <CarouselItem className="basis-auto md:basis-sm md:mr-8" key={1}>
                                <TestimonialCard testimonial={testimonials[1]} />
                            </CarouselItem>
                            <CarouselItem className="basis-auto md:basis-sm md:mr-8" key={2}>
                                <TestimonialCard testimonial={testimonials[2]} />
                            </CarouselItem>
                            <CarouselItem className="basis-auto md:basis-sm md:mr-8" key={3}>
                                <TestimonialCard testimonial={testimonials[0]} />
                            </CarouselItem>
                        </CarouselContent>
                        <div className="">
                            <div className="mt-6 flex gap-4">
                                <CarouselPrevious className="relative -left-0 top-0 -translate-y-0" />
                                <CarouselNext className="relative -left-0 top-0 -translate-y-0" />
                            </div>
                            <div className="space-y-3 mt-6">
                                <p className="max-w-sm text-brand-textSecondary">
                                    Узнайте больше о Курском Государственном Медицинском Университете
                                </p>
                                <Link href="#" className="text-brand-red flex gap-2 items-center text-sm font-medium">
                                    Основной сайт университета <MoveRight size={20} />
                                </Link>
                            </div>
                        </div>
                    </Carousel>
                </div>
            </motion.div>
        </div>
    )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
    return (
        <div className="relative flex aspect-9/16 w-72 shrink-0 snap-start flex-col justify-end overflow-hidden rounded-3xl sm:aspect-3/4 sm:w-96">
            <img loading="lazy" alt="" src={testimonial.src} className="absolute inset-x-0 top-0 aspect-square w-full object-cover" />
            <div aria-hidden="true" className="absolute inset-0 rounded-3xl bg-linear-to-t from-black from-[calc(7/16*100%)] ring-1 ring-gray-950/10 ring-inset sm:from-25%"></div>
            <figure className="relative p-10">
                <blockquote>
                    <p className="relative text-white">
                        <span aria-hidden="true" className="absolute -translate-x-full">“</span>
                        {testimonial.quote}
                        <span aria-hidden="true" className="absolute">”</span>
                    </p>
                </blockquote>
                <figcaption className="mt-6 border-t text-brand-white border-border pt-6">
                    <p className="text-sm/6 font-medium ">{testimonial.name}</p>
                    <p className="text-sm/6 text-brand-white/80">
                        {testimonial.designation}
                    </p>
                </figcaption>
            </figure>
        </div>
    )
}
