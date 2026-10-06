import { LegacyConference } from '@/types/legacy';
import { Link } from '@inertiajs/react';
import { MoveRight } from 'lucide-react';

function formatDate(value: string | null): string {
    if (!value) {
        return '';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString('ru-RU');
}

export function LegacyConferenceCard({ conference }: { conference: LegacyConference }) {
    const imagePath = conference.featured_file?.path
        ? `/legacy-files/${conference.featured_file.path.replace(/^legacy\//, '')}`
        : null;

    return (
        <div className="group relative flex w-full max-w-full flex-col rounded-lg p-4 transition-all duration-300 will-change-transform hover:scale-[1.02] hover:bg-slate-100 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:bg-slate-800 dark:hover:shadow-slate-900/50">
            <Link prefetch href={route('archive.conferences.show', conference.slug)} className="flex w-full flex-col">
                <div className="aspect-[584/384] w-full self-center overflow-hidden rounded-md bg-slate-100 xl:w-[584px]">
                    {imagePath ? (
                        <img src={imagePath} className="size-full object-cover" alt={conference.title} />
                    ) : (
                        <div className="flex size-full items-center justify-center text-slate-400">Архив</div>
                    )}
                </div>
                <div className="w-full pt-5 lg:pt-6">
                    <div className="space-y-3">
                        <span className="text-brand-textSecondary flex items-center gap-2 text-sm font-semibold uppercase">
                            <span>Архив сайта</span>
                            <span>{formatDate(conference.published_at)}</span>
                        </span>
                        <h3 className="text-xl leading-tight font-semibold text-black transition-colors duration-300 sm:text-2xl">{conference.title}</h3>
                        {conference.excerpt && <p className="text-slate-600 dark:text-slate-300">{conference.excerpt}</p>}
                        <div className="text-brand-red flex items-center gap-2 text-sm font-medium transition-all duration-300 group-hover:gap-3">
                            На страницу конференции <MoveRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
