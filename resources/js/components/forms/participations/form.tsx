import { Button } from '@/components/ui/button';
import { Conference } from '@/types/conferences';
import { Link } from '@inertiajs/react';

export default function ParticipationForm({
    conference,
    participation,
}: {
    conference: Conference;
    participation?: { id: number; confirmed: boolean } | null;
}) {
    return (
        <Button asChild className="w-max" variant={participation ? 'brandDarkBlue' : 'default'}>
            <Link href={route('client.conferences.participation', conference.id)}>
                {participation ? 'Управление заявкой' : 'Участвовать'}
            </Link>
        </Button>
    );
}
