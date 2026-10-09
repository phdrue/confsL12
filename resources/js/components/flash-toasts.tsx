import { useToast } from '@/hooks/use-toast';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

export default function FlashToasts() {
    const { flash } = usePage<SharedData>().props;
    const { toast } = useToast();
    const lastShown = useRef<string | null>(null);

    useEffect(() => {
        const key = JSON.stringify({
            error: flash?.error ?? null,
            success: flash?.success ?? null,
        });

        if (key === lastShown.current || (!flash?.error && !flash?.success)) {
            return;
        }

        lastShown.current = key;

        if (flash?.error) {
            toast({
                variant: 'destructive',
                title: flash.error,
            });
        }

        if (flash?.success) {
            toast({
                variant: 'success',
                title: flash.success,
            });
        }
    }, [flash, toast]);

    return null;
}
