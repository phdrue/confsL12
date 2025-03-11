import { Button } from "../ui/button"
import { Link } from "@inertiajs/react"

export default function CTA() {
    return (
        <div className="text-white overflow-hidden mb-0 bg-brand-darkBlue py-24">
            <div className="max-w-screen-xl mx-auto grid lg:grid-cols-2 gap-12 px-4 sm:px-6">
                <div className="lg:py-16 order-2 xl:px-12">
                    <p className="text-4xl lg:text-5xl font-bold">Станьте частью научного сообщества с КГМУ</p>
                    <p className="mt-8">Будем рады слышать Ваши доклады на наших конференциях и видеть результаты Ваших исследований на страницах сборников материалов и журналов Курского государственного медицинского университета.</p>
                    <Button className="mt-8" variant="white" size="buttonLink" asChild>
                        <Link href={route('conferences.index')}>Найти конференцию</Link>
                    </Button>
                </div>
                <div className="order-1 overflow-hidden rounded-3xl">
                    <div className="w-full h-full ">
                        <img loading="lazy" src="img/landing/cta.png" className="size-full object-center object-cover" alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}
