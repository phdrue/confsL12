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
        <Link
            prefetch
            href={route('conferences.show', conference.id)}
            className="group flex w-full max-w-full flex-col rounded-lg p-4 transition-all duration-300 will-change-transform hover:scale-[1.02] hover:bg-slate-100 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:bg-slate-800 dark:hover:shadow-slate-900/50"
        >
            <div className="aspect-[584/384] w-full self-center overflow-hidden rounded-md bg-white xl:w-[584px]">
                <img
                    src={`/storage/${conference.img_path}`}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt={conference.name}
                />
            </div>
            <div className="w-full pt-5 lg:pt-6">
                <div className="space-y-3">
                    <span className="text-brand-textSecondary flex items-baseline gap-2 text-center text-sm font-semibold uppercase">
                        <ConferenceTypeSpan />
                        <span>{conference.date}</span>
                    </span>
                    <h3 className="text-xl leading-tight font-semibold text-black transition-colors duration-300 sm:text-2xl">{conference.name}</h3>
                    <p className="text-slate-600 dark:text-slate-300">{conference.description}</p>
                    <div className="text-brand-red flex items-center gap-2 text-sm font-medium transition-all duration-300 group-hover:gap-3">
                        На страницу конференции <MoveRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
