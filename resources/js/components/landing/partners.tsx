import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import AutoScroll from 'embla-carousel-auto-scroll';

const partnersInfo: { imgPath: string }[] = [
    {
        imgPath: 'img/partners/info/1.png',
    },
    {
        imgPath: 'img/partners/info/2.png',
    },
    {
        imgPath: 'img/partners/info/3.png',
    },
    {
        imgPath: 'img/partners/info/4.png',
    },
    {
        imgPath: 'img/partners/info/5.png',
    },
    {
        imgPath: 'img/partners/info/6.png',
    },
];

const partnersOff: { imgPath: string }[] = [
    {
        imgPath: 'img/partners/off/1.png',
    },
    {
        imgPath: 'img/partners/off/2.jpg',
    },
    {
        imgPath: 'img/partners/off/3.jpg',
    },
    {
        imgPath: 'img/partners/off/4.jpg',
    },
    {
        imgPath: 'img/partners/off/5.png',
    },
    {
        imgPath: 'img/partners/off/6.jpg',
    },
    {
        imgPath: 'img/partners/off/7.png',
    },
];

const partnersStrat: { imgPath: string }[] = [
    {
        imgPath: 'img/partners/strat/1.png',
    },
    {
        imgPath: 'img/partners/strat/2.png',
    },
    {
        imgPath: 'img/partners/strat/3.png',
    },
    {
        imgPath: 'img/partners/strat/4.png',
    },
];

export function PartnersInfo() {
    return (
        <div className="mx-auto mt-0 max-w-screen-xl px-4 pb-8 sm:px-6">
            <p className="text-brand-textSecondary text-center text-xl font-semibold">Информационные партнеры</p>
            <Carousel
                className="mt-6 w-full"
                opts={{
                    loop: true,
                    watchDrag: false,
                }}
                plugins={[
                    AutoScroll({
                        speed: 0.5,
                        direction: 'backward',
                    }),
                ]}
            >
                <div className="absolute top-0 left-0 z-10 h-full w-[100px] bg-gradient-to-r from-white"></div>
                <div className="absolute top-0 right-0 z-10 h-full w-[100px] bg-gradient-to-l from-white"></div>
                <CarouselContent>
                    {partnersInfo.map((partner, index) => (
                        <CarouselItem key={index} className="flex max-h-16 basis-1/2 items-center justify-center md:basis-1/3 lg:basis-1/5">
                            <div className="size-full pl-4">
                                <img className="size-full object-contain" src={partner.imgPath} alt="partner" />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    );
}

export function PartnersOff() {
    return (
        <div className="mx-auto mt-12 max-w-screen-xl px-4 pb-8 sm:px-6">
            <p className="text-brand-textSecondary text-center text-xl font-semibold">Официальные партнеры</p>
            <Carousel
                className="mt-6 w-full"
                opts={{
                    loop: true,
                    watchDrag: false,
                }}
                plugins={[
                    AutoScroll({
                        speed: 0.5,
                        direction: 'backward',
                    }),
                ]}
            >
                <div className="absolute top-0 left-0 z-10 h-full w-[100px] bg-gradient-to-r from-white"></div>
                <div className="absolute top-0 right-0 z-10 h-full w-[100px] bg-gradient-to-l from-white"></div>
                <CarouselContent>
                    {partnersOff.map((partner, index) => (
                        <CarouselItem key={index} className="flex max-h-16 basis-1/2 items-center justify-center md:basis-1/3 lg:basis-1/5">
                            <div className="size-full pl-4">
                                <img className="size-full object-contain" src={partner.imgPath} alt="partner" />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    );
}

export function PartnersStrat() {
    return (
        <div className="mx-auto mt-0 max-w-screen-xl px-4 pb-8 sm:px-6">
            <p className="text-brand-textSecondary text-center text-xl font-semibold">Стратегические партнеры</p>
            <Carousel
                className="mt-4 w-full"
                opts={{
                    loop: true,
                    watchDrag: false,
                }}
                plugins={[
                    AutoScroll({
                        speed: 0.5,
                        direction: 'backward',
                    }),
                ]}
            >
                <div className="absolute top-0 left-0 z-10 h-full w-[100px] bg-gradient-to-r from-white"></div>
                <div className="absolute top-0 right-0 z-10 h-full w-[100px] bg-gradient-to-l from-white"></div>
                <CarouselContent>
                    {partnersStrat.map((partner, index) => (
                        <CarouselItem key={index} className="flex max-h-16 basis-1/3 items-center justify-center md:basis-1/4">
                            <div className="size-full pl-4">
                                <img className="size-full object-contain" src={partner.imgPath} alt="partner" />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    );
}
