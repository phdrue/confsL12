import {
    ChartNoAxesCombined,
    BriefcaseBusiness,
    FileCheck,
    Laugh,
    CircleUserRound,
    BookCheck,
    BookOpenCheck,
    Mails,
    LucideIcon
} from "lucide-react"
import * as motion from "motion/react-client";

const cards: { title: string, content: string, iconName: LucideIcon }[] = [
    {
        iconName: FileCheck,
        title: "Сертификат участника",
        content: "Все зарегистрированные участники конференций получают сертификаты участников, а в случае аккредитации мероприятия – свидетельство комиссии НМО Минздрава России! Помимо регистрации оргкомитет проводит обязательный контроль присутствия, внимания и остаточных знаний аудитории. При удаленной форме участия все документы направляются в электронном виде."
    },
    {
        iconName: ChartNoAxesCombined,
        title: "Повышение публикационной активности и наукометрических показателей",
        content: "Материалы конференций размещаются в открытом доступе, регистрируются и индексируются в РИНЦ, НЭБ (eLIBRARY), на сайтах, экспортируются в открытые международные репозитории научной информации GoogleScholar, OCLC WorldCat, ROAR, BASE, OpenAIRE, RePEc, Соционет. Сборникам материалов присваивается DOI."
    },
    {
        iconName: BriefcaseBusiness,
        title: "Надпрофессиональные навыки, знания, опыт",
        content: "Вам предоставляется возможность выступить с устным или стендовым докладом перед обширной аудиторией ученых и специалистов, опубликовать тезис или полнотекстовую статью! Для педагога, организатора, учёного, политика, врача, фармацевта… бесценным является навык общения с аудиторией, умение спонтанного говорить и отвечать на вопросы незнакомой аудитории. "
    },
    {
        iconName: Laugh,
        title: "Бесплатное участие",
        content: "Организационный взнос за участие в конференциях не взимается! Решение об участии представителей коммерческих структур в мероприятиях конференции обсуждается отдельно. Перед мероприятием и во время перерывов работает выставка представителей бизнеса, реклама товаров и услуг размещается в электронном виде на страницах конференций, а так же на бумажных носителях в программах и сборниках."
    },
]

const features: { title: string, icon: LucideIcon }[] = [
    {
        title: "Личный кабинет",
        icon: CircleUserRound
    },
    {
        title: "Публикация статьи",
        icon: BookCheck,
    },
    {
        title: "Публикация тезисов",
        icon: BookOpenCheck
    },
    {
        title: "Информационная рассылка",
        icon: Mails
    },
]

function Card({ title, content, className, Icon, textColor = "dark:text-white text-black" }: { title: string, content: string, className: string, Icon: LucideIcon, textColor?: string }) {
    return (
        <div
            className={`rounded-3xl px-6 py-6 xl:py-10 xl:px-10 ${className}`}>
            <span className="text-brand-white bg-brand-darkBlue rounded-xl p-2 block max-w-max">
                <Icon />
            </span>
            <p className={`text-xl xl:text-2xl mt-2 font-semibold leading-tight ${textColor}`}>
                {title}
            </p>
            <p className="text-brand-textGrayf text-pretty mt-4">{content}</p>
        </div>
    )
}

export default function Features() {
    return (
        <div
            className="bg-slate-50 w-full pt-16 pb-16 overflow-hidden">
            <div className="max-w-screen-xl mx-auto">
                <div className="px-4 sm:px-6">
                    <h2 className="text-center text-4xl font-semibold">Сайт конференций</h2>
                    <p className="text-brand-textSecondary text-center mt-2">Зачем участвовать в конференциях и что это дает</p>
                </div>
                <div className="px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-3 gap-6 mt-12">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{
                            delay: 0.2,
                            duration: 0.8,
                            ease: "easeInOut",
                        }}
                        viewport={{ once: true }}
                        className="lg:col-span-2">
                        <Card Icon={cards[1].iconName} title={cards[1].title} content={cards[1].content} className="bg-brand-white inset-ring inset-ring-gray-200 shadow-xl shadow-slate-900/10" />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{
                            delay: 0.2,
                            duration: 0.8,
                            ease: "easeInOut",
                        }}
                        viewport={{ once: true }}
                        className="lg:col-span-1 lg:row-span-2 lg:self-end h-max">
                        <Card Icon={cards[0].iconName} title={cards[0].title} content={cards[0].content} className="bg-brand-white inset-ring inset-ring-gray-200 shadow-xl shadow-slate-900/10" />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{
                            delay: 0.2,
                            duration: 0.8,
                            ease: "easeInOut",
                        }}
                        viewport={{ once: true }}
                        className="lg:row-span-2 lg:max-h-max">
                        <Card Icon={cards[2].iconName} title={cards[2].title} content={cards[2].content} className="bg-brand-white inset-ring inset-ring-gray-200 shadow-xl shadow-slate-900/10" />
                    </motion.div>
                    <motion.div
                        initial={{ scale: 0.85 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                            delay: 0.1,
                            duration: 0.4,
                            ease: "easeInOut",
                        }}
                        className="relative px-5 py-7 xl:px-10 xl:py-14 rounded-3xl bg-brand-red text-white shadow-xl shadow-slate-900/10">
                        <p className="text-xl xl:text-2xl font-semibold">Возможности платформы</p>
                        <ul className="space-y-2 mt-6">
                            {features.map((feature) => (
                                <p className="flex gap-2.5 items-center" key={feature.title}>
                                    <feature.icon size={20} />
                                    {feature.title}
                                </p>
                            ))}
                        </ul>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{
                            delay: 0.2,
                            duration: 0.8,
                            ease: "easeInOut",
                        }}
                        viewport={{ once: true }}
                        className="lg:col-span-2">
                        <Card Icon={cards[3].iconName} title={cards[3].title} content={cards[3].content} className="bg-brand-white inset-ring inset-ring-gray-200 shadow-xl shadow-slate-900/10" />
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
