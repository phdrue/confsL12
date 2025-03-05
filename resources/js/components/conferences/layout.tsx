export default function ConferenceLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="mx-auto max-w-screen-xl pt-16 mb-24 w-full">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 mb-16">
                <h2 className="text-center text-3xl sm:text-4xl font-semibold">Актуальные мероприятия</h2>
                <p className="text-brand-textSecondary text-center mt-6">Какие блага получает участник научных мероприятий, принимая в них участие?</p>
            </div>
            <div className="relative flex flex-col lg:flex-row gap-8 lg:px-6">
                <div className="lg:w-3/4">
                    {children}
                </div>
                {/*sidebar*/}
                <div className="lg:w-1/4 px-4 sm:px-6 lg:px-0 sticky h-max top-[calc(77px_+_theme(spacing.16))] flex flex-col gap-8 items-center">
                    {/*banners*/}
                    <div className="rounded-3xl overflow-hidden border bg-card shadow-xs">
                        {/* <AuroraBackground> */}
                        <div className="px-4 pb-6 pt-8">
                            <p className="font-semibold text-center">350+ проведенных конференций</p>
                            <p className="text-center leading-tight mt-2">Присоединяйтесь к научному сообществу вместе с КГМУ</p>
                            <div className="flex gap-4 justify-center mt-6 h-9">
                                <img src="/storage/img/landing/icons/telegram.svg" alt="telegram" className="h-full aspect-square" />
                                <img src="/storage/img/landing/icons/vk.svg" alt="vk" className="h-full aspect-square" />
                                <img src="/storage/img/landing/icons/yt.svg" alt="yt" className="h-full aspect-square" />
                            </div>
                        </div>
                        {/* </AuroraBackground> */}
                    </div>
                    {/*sponsors*/}
                    <div className="flex flex-col items-center">
                        <img src="/storage/img/landing/icons/sp1.png" alt="журнал INNOVA" className="h-[150px] aspect-square object-center" />
                        <p className="text-center mt-2 text-sm">Электронный научный журнал INNOVA</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <img src="/storage/img/landing/icons/sp2.png" alt="Коллекция гуманитарных исследований" className="h-[150px] aspect-square object-center" />
                        <p className="text-center mt-2 text-sm">Коллекция гуманитарных исследований научный журнал</p>
                        <p className="text-center text-sm">Электронный научный журнал</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
