import { ConferenceBlock as ConferenceBlockType } from "@/types/blocks"
import { Conference } from "@/types/conferences"
import { ConferenceBlock } from "./conference-block"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Star } from "lucide-react"
import { useForm, usePage } from "@inertiajs/react"
import { type SharedData } from "@/types"
import { useToast } from "@/hooks/use-toast"

export default function Show({
    blocks,
    conference,
    isEditable = false,
    highlightedBlockId = null,
    onBlockClick,
    registerBlockRef
}: {
    blocks: Array<ConferenceBlockType>,
    conference: Conference,
    isEditable?: boolean,
    highlightedBlockId?: number | null,
    onBlockClick?: (block: ConferenceBlockType) => void,
    registerBlockRef?: (blockId: number, ref: HTMLDivElement | null) => void
}) {
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

    const getTooltipText = () => {
        if (!auth.user) {
            return "Войдите, чтобы добавить в избранное";
        }
        return isStarred ? "Удалить из избранного" : "Добавить в избранное";
    };

    return (
        <div className="w-full flex flex-col gap-8">
            <div className="relative flex items-center justify-center">
                <h1 className="text-center text-3xl font-semibold">{conference.name}</h1>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 h-10 w-10 rounded-full"
                                onClick={handleStarToggle}
                                disabled={processing}
                            >
                                <Star 
                                    size={20} 
                                    className={isStarred ? "fill-amber-400 text-amber-400" : "text-gray-400"} 
                                />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{getTooltipText()}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <div className="self-center aspect-[584/384] w-full max-w-[584px] bg-white rounded-md overflow-hidden">
                <img className="size-full object-cover" alt={conference.name} src={`/files/${conference.img_path}`} />
            </div>
            <div>
                {blocks.map((block) => (
                    <ConferenceBlock 
                        primaryColor={conference.primary_color} 
                        key={block.id} 
                        block={block}
                        isEditable={isEditable}
                        isHighlighted={highlightedBlockId === block.id}
                        onBlockClick={onBlockClick}
                        registerBlockRef={registerBlockRef}
                    />
                ))}
            </div>
        </div>
    )
}