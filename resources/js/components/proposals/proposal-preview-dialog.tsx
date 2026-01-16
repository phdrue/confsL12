import { Proposal } from "@/types/conferences";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface ProposalPreviewDialogProps {
    proposal: Proposal;
    trigger?: React.ReactNode;
    title?: string;
}

export default function ProposalPreviewDialog({ 
    proposal, 
    trigger, 
    title = "Предварительный просмотр предложения" 
}: ProposalPreviewDialogProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" className="w-full justify-start">
                        Просмотр предложения
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    {proposal.img_path && (
                        <div className="w-full max-w-md aspect-video bg-gray-100 rounded-md overflow-hidden">
                            <img 
                                className="w-full h-full object-cover" 
                                alt={proposal.payload.shortName}
                                src={`/storage/${proposal.img_path}`}
                            />
                        </div>
                    )}
                    <div className="grid gap-4">
                        <div>
                            <h3 className="font-semibold text-lg">Основная информация</h3>
                            <div className="space-y-2 mt-2">
                                <div>
                                    <span className="font-medium">Полное название (RUS):</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.name}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Краткое название (RUS):</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.shortName}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Название (ENG):</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.engName}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Краткое название (ENG):</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.engShortName}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Уровень:</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.level}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Форма проведения:</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.form}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Вид мероприятия:</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.type}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Язык конференции:</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.lang}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg">Даты и место</h3>
                            <div className="space-y-2 mt-2">
                                <div>
                                    <span className="font-medium">Дата начала:</span>
                                    <p className="text-sm text-gray-600">{new Date(proposal.payload.date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Дата окончания:</span>
                                    <p className="text-sm text-gray-600">{new Date(proposal.payload.endDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Место проведения:</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.place}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg">Организация</h3>
                            <div className="space-y-2 mt-2">
                                <div>
                                    <span className="font-medium">Кафедра:</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.department}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Организатор:</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.organization}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Соорганизаторы:</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.organizationOther}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg">Участники</h3>
                            <div className="space-y-2 mt-2">
                                <div>
                                    <span className="font-medium">Общее количество участников:</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.participationsTotal}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Иностранные участники:</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.participationsForeign}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg">Публикации</h3>
                            <div className="space-y-2 mt-2">
                                <div>
                                    <span className="font-medium">Формат сборника:</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.bookType}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Основные направления:</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.topics}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Бюджет:</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.budget}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Источники бюджета:</span>
                                    <p className="text-sm text-gray-600">{proposal.payload.budgetSource}</p>
                                </div>
                            </div>
                        </div>

                        {proposal.payload.audiences && proposal.payload.audiences.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-lg">Целевая аудитория</h3>
                                <div className="mt-2">
                                    <ul className="list-disc list-inside space-y-1">
                                        {proposal.payload.audiences.map((audience, index) => (
                                            <li key={index} className="text-sm text-gray-600">{audience}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {proposal.payload.amenities && proposal.payload.amenities.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-lg">Дополнительные услуги</h3>
                                <div className="mt-2">
                                    <ul className="list-disc list-inside space-y-1">
                                        {proposal.payload.amenities.map((amenity, index) => (
                                            <li key={index} className="text-sm text-gray-600">{amenity}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
