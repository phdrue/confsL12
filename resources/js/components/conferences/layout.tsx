export default function ConferenceLayout({ heading, children, showHeader = true }: { heading: string, children: React.ReactNode, showHeader?: boolean }) {
    return (
        <div className="mx-auto mb-24 w-full max-w-screen-xl pt-16">
            {showHeader && (
                <div className="mx-auto mb-16 max-w-2xl px-4 sm:px-6">
                    <h2 className="text-center text-3xl font-semibold sm:text-4xl">Мероприятия: {heading.toLocaleLowerCase()}</h2>
                    <p className="text-brand-textSecondary mt-6 text-center">
                        Какие блага получает участник научных мероприятий, принимая в них участие?
                    </p>
                </div>
            )}
            <div className="relative flex flex-col gap-8 lg:flex-row lg:px-6">
                <div className="lg:w-3/4">{children}</div>
                {/*sidebar*/}
                <div className="sticky top-[calc(77px_+_theme(spacing.16))] flex h-max flex-col items-center gap-8 px-4 sm:px-6 lg:w-1/4 lg:px-0">
                    {/*banners*/}
                    <div className="bg-card overflow-hidden rounded-3xl border shadow-xs">
                        {/* <AuroraBackground> */}
                        <div className="px-4 pt-8 pb-6">
                            {/* <p className="font-semibold text-center">350+ проведенных конференций</p> */}
                            <p className="mt-2 text-center leading-tight">Присоединяйтесь к научному сообществу вместе с КГМУ</p>
                            <div className="mt-6 flex h-9 justify-center gap-4">
                                <img src="/img/landing/icons/telegram.svg" alt="telegram" className="aspect-square h-full" />
                                <img src="/img/landing/icons/vk.svg" alt="vk" className="aspect-square h-full" />
                                <img src="/img/landing/icons/yt.svg" alt="yt" className="aspect-square h-full" />
                            </div>
                        </div>
                        {/* </AuroraBackground> */}
                    </div>
                    {/*sponsors*/}
                    <a href="https://www.innova-journal.ru/jour" target="_blank" className="flex flex-col items-center">
                        <img src="/img/landing/icons/sp1.png" alt="журнал INNOVA" className="aspect-square h-[150px] object-center" />
                        <p className="mt-2 text-center text-sm">Электронный научный журнал INNOVA</p>
                    </a>
                    <a href="https://www.j-chr.com/jour" target="_blank" className="flex flex-col items-center">
                        <img
                            src="/img/landing/icons/sp2.png"
                            alt="Коллекция гуманитарных исследований"
                            className="aspect-square h-[150px] object-center"
                        />
                        <p className="mt-2 text-center text-sm">Коллекция гуманитарных исследований научный журнал</p>
                        <p className="text-center text-sm">Электронный научный журнал</p>
                    </a>
                </div>
            </div>
        </div>
    );
}
