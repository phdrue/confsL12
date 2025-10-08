import { Conference } from '@/types/conferences';
import { Link } from '@inertiajs/react';
import { MoveRight } from 'lucide-react';

export function ConferenceCard({ conference }: { conference: Conference }) {
    const ConferenceTypeSpan = () => {
        switch (conference.type_id) {
            case 1: return <span className={`text-sm text-brand-lime`}>#Региональная</span>
            case 2: return <span className={`text-sm text-brand-cyan`}>#Всероссийская</span>
            case 3: return <span className={`text-sm text-brand-green`}>#Международная</span>
            case 4: return <span className={`text-sm text-brand-blue`}>#Другая</span>
        }
    }

    return (
        <article className="max-w-full flex flex-col w-full">
            <div className="self-center aspect-[584/384] w-full xl:w-[584px] bg-white rounded-md overflow-hidden">
                <img src={`/storage/${conference.img_path}`} className="size-full object-cover" alt={conference.name} />
            </div>
            <div className="pt-5 lg:pt-6 w-full">
                <div className="space-y-3">
                    <span className="flex gap-2 items-baseline text-center uppercase text-sm font-semibold text-brand-textSecondary">
                        <ConferenceTypeSpan />
                        <span>{conference.date}</span>
                    </span>
                    <h3 className="text-xl sm:text-2xl font-semibold leading-tight dark:text-white text-black">{conference.name}</h3>
                    <p className="">{conference.description}</p>
                    <Link prefetch href={route('conferences.show', conference.id)} className="text-brand-red flex gap-2 items-center text-sm font-medium focus:outline-none focus:underline">
                        На страницу конференции <MoveRight size={20} />
                    </Link>
                </div>
            </div>
        </article>
    )
}