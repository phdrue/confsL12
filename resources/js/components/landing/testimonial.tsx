import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Link } from '@inertiajs/react';
import { MoveRight } from 'lucide-react';
import * as motion from 'motion/react-client';

type Testimonial = {
    quote: string;
    name: string;
    designation: string;
    src: string;
};

const testimonials: Testimonial[] = [
    {
        quote: 'Организация и проведение научных и образовательных мероприятий – большой труд. И это не только труд физический, умственный, но и духовный. Накопив опыт в определенной научной сфере, исследователь не может не поделиться им с единомышленниками, соратниками, учениками. Желаю не останавливаться на достигнутом, расширять спектр исследований, проводить более углубленные и качественные изыскания, а их результаты сообщать на конференциях, организуемых на базе Курского государственного медицинского университета, публиковаться на страницах наших изданий.',
        name: 'В.А. Лазаренко',
        designation: 'Ректор профессор КГМУ, заслуженный врач Российской Федерации, заслуженный деятель науки Российской Федерации',
        src: 'img/landing/testimonials/1.png',
    },
    {
        quote: 'Курский государственный медицинский университет уже 90 лет соответствует постоянно меняющимся стратегическим целям, стоящим перед медицинским образованием и наукой. Вуз выпустил десятки передовых ученых, внесших существенный вклад в развитие медицинской науки нашей страны. Их идеи сейчас успешно внедрены в практику и позволяют оказать высококлассную помощь сотням тысяч человек ежегодно. По мнению ведущих рейтинговых агентств, КГМУ ежегодно входит в десятку лучших медицинских вузов России, а в качестве научной организации вуз входит в пятерку лучших учреждений среди медицинских вузов Российской Федерации.',
        name: 'М.А. Мурашко',
        designation: 'Министр здравоохранения Российской Федерации',
        src: 'img/landing/testimonials/2.png',
    },
    {
        quote: 'Качественное проведение актуальных научных мероприятий повышает теоретический и практический уровень молодых ученых, мотивирует студентов и позитивно влияет на имидж нашей Alma Mater. Многие кафедры и отдельные сотрудники-инициаторы, сформировали позитивную практику организации регулярных конференций, многие из них стали традиционными. Это указывает на наличие сложившейся на кафедрах и НИИ исследовательской и педагогической школы, что не может не радовать, позволяет гордиться такими учеными и не беспокоится о перспективах развития исследований в направлениях, соответствующих Стратегии научно-технологического развития России.',
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
        <div className="relative flex aspect-9/16 w-72 shrink-0 snap-start flex-col justify-end overflow-hidden rounded-3xl sm:aspect-3/4 sm:w-96">
            <img loading="lazy" alt="" src={testimonial.src} className="absolute inset-x-0 top-0 aspect-square w-full object-cover" />
            <div
                aria-hidden="true"
                className="absolute inset-0 rounded-3xl bg-linear-to-t from-black from-[calc(7/16*100%)] ring-1 ring-gray-950/10 ring-inset sm:from-25%"
            ></div>
            <figure className="relative p-10">
                <blockquote>
                    <p className="relative text-white">
                        <span aria-hidden="true" className="absolute -translate-x-full">
                            “
                        </span>
                        <span className="">{testimonial.quote}</span>
                        <span aria-hidden="true" className="absolute">
                            ”
                        </span>
                    </p>
                </blockquote>
                <figcaption className="text-brand-white border-border mt-6 border-t pt-6">
                    <p className="text-sm/6 font-medium">{testimonial.name}</p>
                    <p className="text-brand-white/80 text-sm/6">{testimonial.designation}</p>
                </figcaption>
            </figure>
        </div>
    );
}
