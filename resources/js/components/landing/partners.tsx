import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
import AutoScroll from 'embla-carousel-auto-scroll'

const partnersInfo: { imgPath: string }[] = [
    {
        imgPath: "img/partners/info/1.png",
    },
    {
        imgPath: "img/partners/info/2.png",
    },
    {
        imgPath: "img/partners/info/3.png",
    },
    {
        imgPath: "img/partners/info/4.png",
    },
    {
        imgPath: "img/partners/info/5.png",
    },
    {
        imgPath: "img/partners/info/6.png",
    },
]

const partnersOff: { imgPath: string }[] = [
    {
        imgPath: "img/partners/off/1.png",
    },
    {
        imgPath: "img/partners/off/2.jpg",
    },
    {
        imgPath: "img/partners/off/3.jpg",
    },
    {
        imgPath: "img/partners/off/4.jpg",
    },
    {
        imgPath: "img/partners/off/5.png",
    },
    {
        imgPath: "img/partners/off/6.jpg",
    },
    {
        imgPath: "img/partners/off/7.png",
    },
]

const partnersStrat: { imgPath: string }[] = [
    {
        imgPath: "img/partners/strat/1.png",
    },
    {
        imgPath: "img/partners/strat/2.png",
    },
    {
        imgPath: "img/partners/strat/3.png",
    },
    {
        imgPath: "img/partners/strat/4.png",
    },
]

export function PartnersInfo() {
    return (
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 mt-10 pb-16">
            <p className="text-center uppercase text-sm font-semibold text-brand-textSecondary">Информационные партнеры</p>
            <Carousel className="w-full mt-6"
                opts={{
                    loop: true,
                    watchDrag: false
                }}
                plugins={[
                    AutoScroll({
                        speed: 0.5
                    })
                ]}
            >
                <div className="absolute left-0 top-0 z-10 h-full w-[100px] bg-gradient-to-r from-white"></div>
                <div className="absolute right-0 top-0 z-10 h-full w-[100px] bg-gradient-to-l from-white"></div>
                <CarouselContent>
                    {
                        partnersInfo.map((partner, index) =>
                            <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/5 max-h-16 items-center justify-center flex">
                                <div className="pl-4 size-full">
                                    <img className="object-contain size-full" src={partner.imgPath} alt="partner" />
                                </div>
                            </CarouselItem>
                        )
                    }
                </CarouselContent>
            </Carousel>
        </div>
    )
}

export function PartnersOff() {
    return (
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 mt-10 pb-16">
            <p className="text-center uppercase text-sm font-semibold text-brand-textSecondary">Официальные партнеры</p>
            <Carousel className="w-full mt-6"
                opts={{
                    loop: true,
                    watchDrag: false
                }}
                plugins={[
                    AutoScroll({
                        speed: 0.5
                    })
                ]}
            >
                <div className="absolute left-0 top-0 z-10 h-full w-[100px] bg-gradient-to-r from-white"></div>
                <div className="absolute right-0 top-0 z-10 h-full w-[100px] bg-gradient-to-l from-white"></div>
                <CarouselContent>
                    {
                        partnersOff.map((partner, index) =>
                            <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/5 max-h-16 items-center justify-center flex">
                                <div className="pl-4 size-full">
                                    <img className="object-contain size-full" src={partner.imgPath} alt="partner" />
                                </div>
                            </CarouselItem>
                        )
                    }
                </CarouselContent>
            </Carousel>
        </div>
    )
}

export function PartnersStrat() {
    return (
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 mt-10 pb-16">
            <p className="text-center uppercase text-sm font-semibold text-brand-textSecondary">Стратегические партнеры</p>
            <Carousel className="w-full mt-6"
                opts={{
                    loop: true,
                    watchDrag: false
                }}
                plugins={[
                    AutoScroll({
                        speed: 0.5
                    })
                ]}
            >
                <div className="absolute left-0 top-0 z-10 h-full w-[100px] bg-gradient-to-r from-white"></div>
                <div className="absolute right-0 top-0 z-10 h-full w-[100px] bg-gradient-to-l from-white"></div>
                <CarouselContent>
                    {
                        partnersStrat.map((partner, index) =>
                            <CarouselItem key={index} className="basis-1/3 md:basis-1/4 max-h-16 items-center justify-center flex">
                                <div className="pl-4 size-full">
                                    <img className="object-contain size-full" src={partner.imgPath} alt="partner" />
                                </div>
                            </CarouselItem>
                        )
                    }
                </CarouselContent>
            </Carousel>
        </div>
    )
}
