import { Conference } from '@/types/conferences';
import { Link, useForm, usePage } from '@inertiajs/react';
import { MoveRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type SharedData } from '@/types';
import { useToast } from '@/hooks/use-toast';

export function ConferenceCard({ conference }: { conference: Conference }) {
    const { auth } = usePage<SharedData>().props;
    const { post, delete: destroy, processing } = useForm({});
    const { toast } = useToast();
    
    const isStarred = conference.is_starred ?? false;
    
    const handleStarToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!auth.user) {
            toast({
                variant: "default",
                title: "Войдите, чтобы добавить конференцию в избранное",
                description: "Необходимо войти в систему для использования этой функции",
            });
            return;
        }
        
        if (isStarred) {
            destroy(route('client.conferences.unstar', conference.id), {
                preserveScroll: true,
                onSuccess: () => {
                    toast({
                        variant: "success",
                        title: "Конференция удалена из избранного",
                    });
                },
                onError: () => {
                    toast({
                        variant: "destructive",
                        title: "Ошибка при удалении из избранного",
                    });
                }
            });
        } else {
            post(route('client.conferences.star', conference.id), {
                preserveScroll: true,
                onSuccess: () => {
                    toast({
                        variant: "success",
                        title: "Конференция добавлена в избранное",
                    });
                },
                onError: () => {
                    toast({
                        variant: "destructive",
                        title: "Ошибка при добавлении в избранное",
                    });
                }
            });
        }
    };

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
        <div className="group relative flex w-full max-w-full flex-col rounded-lg p-4 transition-all duration-300 will-change-transform hover:scale-[1.02] hover:bg-slate-100 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:bg-slate-800 dark:hover:shadow-slate-900/50">
            <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800"
                onClick={handleStarToggle}
                disabled={processing}
            >
                <Star 
                    size={18} 
                    className={isStarred ? "fill-amber-400 text-amber-400" : "text-gray-400"} 
                />
            </Button>
            <Link
                prefetch
                href={route('conferences.show', conference.id)}
                className="flex w-full flex-col"
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
        </div>
    );
}
