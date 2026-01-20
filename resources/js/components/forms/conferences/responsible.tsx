import { useForm } from '@inertiajs/react';
import { LoaderCircle, Search, X } from 'lucide-react';
import { FormEventHandler, useState, useMemo, useRef, useEffect } from 'react';
import { Conference, ConferenceType } from '@/types/conferences';
import { useToast } from "@/hooks/use-toast"

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from "@/components/ui/dialog"
import { User } from "@/types";
import { cn } from '@/lib/utils';

export default function ResponsibleForm({
    conference,
    users
}: {
    users: Array<User>,
    conference: Conference
}) {
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
        setSearchQuery('');
        setUserId('');
        setShowDropdown(false);
    };

    const [userId, setUserId] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { toast } = useToast()
    const { post, processing, errors, reset } = useForm({
        _method: 'put'
    });

    const filteredUsers = useMemo(() => {
        if (!searchQuery.trim()) {
            return users;
        }
        const query = searchQuery.toLowerCase();
        return users.filter((user) => {
            const email = user.email?.toLowerCase() || '';
            const lastName = user.last_name?.toLowerCase() || '';
            const firstName = user.first_name?.toLowerCase() || '';
            const secondName = user.second_name?.toLowerCase() || '';
            const fullName = `${lastName} ${firstName} ${secondName}`.toLowerCase();
            
            return email.includes(query) || 
                   lastName.includes(query) || 
                   firstName.includes(query) || 
                   secondName.includes(query) ||
                   fullName.includes(query);
        });
    }, [users, searchQuery]);

    const selectedUser = useMemo(() => {
        return users.find(u => String(u.id) === userId);
    }, [users, userId]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                searchInputRef.current &&
                !searchInputRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleUserSelect = (user: User) => {
        setUserId(String(user.id));
        setSearchQuery(`${user.email} ${user.last_name || ''} ${user.first_name || ''} ${user.second_name || ''}`.trim());
        setShowDropdown(false);
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setShowDropdown(true);
        if (!value) {
            setUserId('');
        }
    };

    const clearSelection = () => {
        setUserId('');
        setSearchQuery('');
        setShowDropdown(true);
        searchInputRef.current?.focus();
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!userId) return;
        
        post(route('adm.conferences.toggle-responsible', [conference.id, userId]), {
            forceFormData: true,
            onSuccess: () => {
                handleClose()
                toast({
                    variant: "success",
                    title: "Ответственный успешно создана!",
                })
                reset()
            }
        })
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Добавить</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Добавить ответственного</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="user_search">Пользователь</Label>
                            <div className="relative">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        ref={searchInputRef}
                                        id="user_search"
                                        type="text"
                                        placeholder="Поиск по email, имени или фамилии..."
                                        value={searchQuery}
                                        onChange={(e) => handleSearchChange(e.target.value)}
                                        onFocus={() => setShowDropdown(true)}
                                        className="pl-9 pr-9"
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={clearSelection}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                                {showDropdown && filteredUsers.length > 0 && (
                                    <div
                                        ref={dropdownRef}
                                        className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-auto"
                                    >
                                        {filteredUsers.map((user) => (
                                            <button
                                                key={user.id}
                                                type="button"
                                                onClick={() => handleUserSelect(user)}
                                                className={cn(
                                                    "w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors",
                                                    String(user.id) === userId && "bg-accent text-accent-foreground"
                                                )}
                                            >
                                                <div className="font-medium">{user.email}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {[user.last_name, user.first_name, user.second_name].filter(Boolean).join(' ') || 'Без имени'}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {showDropdown && searchQuery && filteredUsers.length === 0 && (
                                    <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg p-4 text-center text-muted-foreground">
                                        Пользователи не найдены
                                    </div>
                                )}
                            </div>
                            <InputError message={errors.user_id} />
                        </div>

                        {userId && (
                            <div className="p-3 bg-muted rounded-md">
                                <div className="text-sm font-medium">Выбранный пользователь:</div>
                                <div className="text-sm text-muted-foreground">
                                    {selectedUser?.email} {selectedUser?.last_name} {selectedUser?.first_name} {selectedUser?.second_name}
                                </div>
                            </div>
                        )}

                        {userId && (
                            <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                Создать
                            </Button>
                        )}
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
