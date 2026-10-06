import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

type DraftAuthor = {
    name: string;
    organization?: string;
    city?: string;
};

export type DraftDocumentItem = {
    key: string;
    topic: string;
    authors?: Array<DraftAuthor>;
};

export default function DraftDocumentList({
    items,
    countries,
    canDelete,
    onDelete,
}: {
    items: Array<DraftDocumentItem>;
    canDelete: boolean;
    onDelete: (item: DraftDocumentItem) => void;
}) {
    if (items.length === 0) {
        return <p className="text-sm text-muted-foreground">Пока ничего не приложено.</p>;
    }

    return (
        <div className="space-y-3">
            {items.map((item) => (
                <div key={item.key} className="flex items-start justify-between gap-3 border-b border-border/60 py-3 last:border-b-0">
                    <div className="min-w-0">
                        <p className="break-words font-medium">{item.topic}</p>
                        {item.authors && item.authors.length > 0 && (
                            <p className="mt-1 text-sm text-muted-foreground">
                                {item.authors.map((author) => author.name).join(', ')}
                            </p>
                        )}
                    </div>
                    {canDelete && (
                        <Button
                            type="button"
                            variant="outline"
                            className="shrink-0 hover:text-red-600"
                            onClick={() => onDelete(item)}
                        >
                            <Trash2 className="h-4 w-4" />
                            Удалить
                        </Button>
                    )}
                </div>
            ))}
        </div>
    );
}
