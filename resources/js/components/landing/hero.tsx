import HeroTextRotate from "@/components/landing/hero-text-rotate"
import { Button } from "@/components/ui/button"
import { Link } from "@inertiajs/react"
import { MoveRight } from "lucide-react"

const text: string = "Руководство Курского Государственного Медицинского Университета надеется, что исследовательская деятельность станет мощным мотиватором для молодежи, а ведущие ученые помогут изучить основные вопросы заболеваний и разработать новые методы диагностики, лечения и профилактики."

export default function Hero() {
    return (
        <div
            className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full pt-12 pb-16 max-w-screen-xl mx-auto items-center px-4 sm:px-6">
            <div>
                <h1 className="block font-bold text-4xl lg:text-6xl lg:leading-none">
                    Научные
                    <span className="block py-1.5">
                        <HeroTextRotate />
                    </span>
                    Конференции в <a target="_blank" href="https://kurskmed.com" className="focus:underline focus:outline-none text-brand-darkBlue hover:underline">КГМУ</a>
                </h1>
                <p className="text-base leading-relaxed mt-3 max-w-lg py-7 text-brand-textSecondary">
                    {text}
                </p>
                <div className="flex flex-col gap-3 w-full sm:w-max sm:flex-row sm:gap-6">
                    <Button variant="brandDarkBlue" className="w-full lg:text-base" size="buttonLink" asChild>
                        <Link href={route('conferences.index')}>
                            Участвовать
                            <MoveRight />
                        </Link>
                    </Button>
                    <Button variant="outline" className="w-full lg:text-base" size="buttonLink" asChild>
                        <Link href={route('login')}>
                            Личный кабинет
                        </Link>
                    </Button>
                </div>
            </div>
            <div className="flex justify-center xl:px-16">
                <div className="aspect-square w-full xl:w-auto sm:max-md:max-h-[400px] xl:h-[600px]">
                    <img className="size-full object-cover" src="/img/landing/hero1.jpg" alt="hero" />
                </div>
            </div>
        </div>
    )
}
