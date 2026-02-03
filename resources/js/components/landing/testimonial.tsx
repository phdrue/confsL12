import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Link } from '@inertiajs/react';
import { MoveRight, Flag } from 'lucide-react';
import * as motion from 'motion/react-client';
import { Badge } from '@/components/ui/badge';

type Testimonial = {
    quote: string;
    name: string;
    designation: string;
    src: string;
};

const testimonials: Testimonial[] = [
    {
        quote: 'Организация и проведение научных и образовательных мероприятий – большой труд. Накопив опыт в определенной научной сфере, исследователь не может не поделиться им с единомышленниками. Желаю не останавливаться на достигнутом, расширять спектр исследований, проводить более углубленные и качественные изыскания, а их результаты сообщать на конференциях, организуемых на базе КГМУ.',
        name: 'В.А. Лазаренко',
        designation: 'Ректор профессор КГМУ, заслуженный врач Российской Федерации, заслуженный деятель науки Российской Федерации',
        src: 'img/landing/testimonials/1.png',
    },
    {
        quote: 'КГМУ уже более 90 лет соответствует постоянно меняющимся стратегическим целям, стоящим перед медицинским образованием и наукой. По мнению ведущих рейтинговых агентств, КГМУ в качестве научной организации входит в пятерку лучших учреждений среди медицинских вузов России.',
        name: 'М.А. Мурашко',
        designation: 'Министр здравоохранения Российской Федерации',
        src: 'img/landing/testimonials/2.png',
    },
    {
        quote: 'Качественное проведение актуальных научных мероприятий повышает теоретический и практический уровень молодых ученых. Многие кафедры и отдельные сотрудники сформировали позитивную практику организации регулярных конференций, многие из них стали традиционными. Это указывает на наличие сложившейся в КМГУ исследовательской и педагогической школы, что не может не радовать и позволяет гордиться такими учеными.',
        name: 'В.А. Липатов',
        designation: 'Проректор по научной работе и инновационному развитию профессор',
        src: 'img/landing/testimonials/3.png',
    },
];

export default function Testimonial() {
    return (
        <div className="mx-auto w-full max-w-screen-xl py-16">
            <motion.div
                initial={{ translateY: 120, opacity: 0 }}
                whileInView={{ translateY: 0, opacity: 1 }}
                transition={{
                    delay: 0.2,
                    duration: 0.8,
                    ease: 'easeInOut',
                }}
                viewport={{ once: true }}
                className="w-full"
            >
                <div className="px-4 sm:px-6">
                    <h2 className="text-center text-3xl font-semibold sm:text-4xl">Слово от наших руководителей</h2>
                </div>
                <div className="mt-12 px-4 sm:px-6">
                    <Carousel
                        opts={{
                            align: 'start',
                            // loop: true,
                        }}
                    >
                        <CarouselContent className="mr-0">
                            <CarouselItem className="basis-auto md:mr-8 md:basis-sm" key={0}>
                                <TestimonialCard testimonial={testimonials[0]} />
                            </CarouselItem>
                            <CarouselItem className="basis-auto md:mr-8 md:basis-sm" key={1}>
                                <TestimonialCard testimonial={testimonials[1]} />
                            </CarouselItem>
                            <CarouselItem className="basis-auto md:mr-8 md:basis-sm" key={2}>
                                <TestimonialCard testimonial={testimonials[2]} />
                            </CarouselItem>
                        </CarouselContent>
                        <div className="">
                            <div className="mt-6 flex gap-4">
                                <CarouselPrevious className="relative top-0 -left-0 -translate-y-0" />
                                <CarouselNext className="relative top-0 -left-0 -translate-y-0" />
                            </div>
                            <div className="mt-6 space-y-3">
                                <p className="text-brand-textSecondary max-w-sm">Узнайте больше о Курском Государственном Медицинском Университете</p>
                                <Link
                                    href="https://kurskmed.com/"
                                    className="text-brand-red flex w-max items-center gap-2 text-sm font-medium focus:underline focus:outline-none"
                                >
                                    Официальный сайт университета <MoveRight size={20} />
                                </Link>
                            </div>
                        </div>
                    </Carousel>
                </div>
            </motion.div>
        </div>
    );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
    return (
        <div className="group relative flex aspect-9/16 w-72 shrink-0 snap-start flex-col justify-end overflow-hidden rounded-3xl sm:aspect-3/4 sm:w-96">
            <img loading="lazy" alt="" src={testimonial.src} className="absolute inset-x-0 top-0 size-full object-cover" />
            {/* <div
                aria-hidden="true"
                className="absolute inset-0 rounded-3xl bg-linear-to-t from-black from-[calc(7/16*100%)] ring-1 ring-gray-950/10 ring-inset opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100 sm:from-25%"
            ></div> */}

            <figure className="bg-linear-to-t from-black from-[calc(7/16*100%)] absolute inset-x-0 bottom-0 flex flex-col justify-end p-5 sm:p-10">
                <figcaption className="text-brand-white border-border pb-3 transition-all duration-500 ease-in-out">
                    <p className="text-xl font-bold uppercase leading-tight text-white sm:text-2xl">{testimonial.name}</p>
                </figcaption>
                <blockquote className="grid transition-[grid-template-rows] duration-500 ease-in-out [grid-template-rows:0fr] group-hover:[grid-template-rows:1fr]">
                    <p className="relative min-h-0 overflow-hidden text-white">
                        <span className="block opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100">
                            {testimonial.quote}
                        </span>
                    </p>
                </blockquote>
            </figure>
        </div>
    );
}
