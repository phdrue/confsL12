import { Link } from "@inertiajs/react";
import AppLogoIcon from "../app-logo-icon";

export default function Footer() {
    return (
        <footer className="w-full bg-white mt-12">
            <div className="max-w-screen-xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-row justify-between py-8">
                    <AppLogoIcon />
                    <div className="flex flex-row gap-8 text-sm">
                        <div className="flex flex-col gap-2">
                            <Link className="px-3" href={route('home')}>Главная</Link>
                            <Link className="px-3" href={route('conferences.index')}>Мероприятия</Link>
                            <Link className="px-3" href={route('subscribe')}>Рассылка</Link>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Link className="px-3" href={route('dashboard')}>Личный кабинет</Link>
                            <Link className="px-3" href={route('contacts')}>Контакты</Link>
                        </div>
                    </div>
                </div>
                <div className="border-t border-border pt-8 pb-4 flex justify-between">
                    <p className="text-xs">© 2025 КГМУ</p>
                    <div className="flex gap-8">
                        <Link className="text-xs underline" href="#">Пользовательское соглашение</Link>
                        <Link className="text-xs underline" href="#">Политика конфиденциальности</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
