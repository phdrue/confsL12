import { Conference } from '@/types/conferences';
import { Link } from '@inertiajs/react';
import { MoveRight } from 'lucide-react';

export function ConferenceCard({ conference }: { conference: Conference }) {
    const ConferenceTypeSpan = () => {
        switch (conference.type_id) {
            case 1:
                return <span className={`text-brand-lime text-sm`}>#Региональная</span>;
            case 2:
                return <span className={`text-brand-cyan text-sm`}>#Всероссийская</span>;
            case 3:
                return <span className={`text-brand-green text-sm`}>#Международная</span>;
            case 4:
                return <span className={`text-brand-blue text-sm`}>#Другая</span>;
        }
    };

    return (
        <article className="flex w-full hover:bg-slate-200 max-w-full flex-col">
            <div className="aspect-[584/384] w-full self-center overflow-hidden rounded-md bg-white xl:w-[584px]">
                <img src={`/storage/${conference.img_path}`} className="size-full object-cover" alt={conference.name} />
            </div>
            <div className="w-full pt-5 lg:pt-6">
                <div className="space-y-3">
                    <span className="text-brand-textSecondary flex items-baseline gap-2 text-center text-sm font-semibold uppercase">
                        <ConferenceTypeSpan />
                        <span>{conference.date}</span>
                    </span>
                    <Link
                        prefetch
                        href={route('conferences.show', conference.id)}
                        className="text-xl leading-tight font-semibold text-black sm:text-2xl dark:text-white"
                    >
                        {conference.name}
                    </Link>
                    <p className="">{conference.description}</p>
                    <Link
                        prefetch
                        href={route('conferences.show', conference.id)}
                        className="text-brand-red flex items-center gap-2 text-sm font-medium focus:underline focus:outline-none"
                    >
                        На страницу конференции <MoveRight size={20} />
                    </Link>
                </div>
            </div>
        </article>
    );
}
