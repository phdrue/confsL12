import { Link } from '@inertiajs/react';
import AppLogoIcon from '../app-logo-icon';

export default function Footer() {
    return (
        <footer className="mt-12 w-full bg-white">
            <div className="mx-auto max-w-screen-xl px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex flex-row justify-between py-8">
                    <Link href="https://kurskmed.com/">
                        <AppLogoIcon />
                    </Link>
                    <div className="flex flex-row gap-8 text-sm">
                        <div className="flex flex-col gap-2">
                            <Link className="px-3" href={route('home')}>
                                Главная
                            </Link>
                            <Link className="px-3" href={route('conferences.index')}>
                                Мероприятия
                            </Link>
                            <Link className="px-3" href={route('subscribe')}>
                                Рассылка
                            </Link>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Link className="px-3" href={route('dashboard')}>
                                Личный кабинет
                            </Link>
                            <Link className="px-3" href={route('contacts')}>
                                Контакты
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="border-border flex justify-between border-t pt-8 pb-4">
                    <p className="text-xs">© 2025 КГМУ</p>
                    <div className="flex gap-8">
                        {/* <Link className="text-xs underline" href="#">Пользовательское соглашение</Link> */}
                        <a className="text-xs underline" href="https://kurskmed.com/adm_files/politic_personal_data.pdf/" target="_blank">
                            Политика конфиденциальности
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
