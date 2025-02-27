export default function ConferenceLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="mx-auto max-w-screen-xl pt-16 mb-24">
            <div className="mb-16">
                <h2 className="text-center text-4xl font-semibold">Платформа конференций</h2>
                <p className="text-brand-textSecondary text-center mt-2">Какие блага получает участник научных мероприятий, принимая в них участие?</p>
            </div>
            <div className="relative flex gap-8">
                <div className="w-3/4">
                    {children}
                </div>
                {/*sidebar*/}
                <div className="w-1/4 sticky h-max top-[calc(77px_+_theme(spacing.16))] flex flex-col gap-8 items-center">
                    {/*banners*/}
                    <div className="rounded-3xl overflow-hidden bg-brand-white shadow-xl shadow-slate-900/10">
                        {/* <AuroraBackground> */}
                        <div className="px-4 pb-6 pt-8">
                            <p className="font-semibold text-center">150+ проведенных конференций</p>
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
                        <img src="/storage/img/landing/icons/sp1.png" alt="" className="h-[150px] aspect-square object-center" />
                        <p className="text-center">Электронный научный журнал INNOVA</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <img src="/storage/img/landing/icons/sp2.png" alt="" className="h-[150px] aspect-square object-center" />
                        <p className="text-center">Коллекция гуманитарных исследований</p>
                        <p className="text-center">Электронный научный журнал</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
