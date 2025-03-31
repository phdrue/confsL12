import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface RegisterForm {
    email: string;
    password: string;
    password_confirmation: string;
}

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Регистрация" description="Заполните поля ниже для создания аккаунта платформы Конференций КГМУ">
            <Head title="Регистрация" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">

                    <div className="grid gap-2">
                        <Label htmlFor="email">Адрес электронной почты</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Пароль</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Пароль"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Подтверждение пароля</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Подтверждение пароля"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <div className="grid gap-2">
                        <p className="text-sm">Регистрируясь на сайте, вы соглашаетесь с <a href={route('download.policy')} className="text-brand-red hover:underline">политикой обработки персональных данных</a></p>
                    </div>

                    <Button variant={"brandDarkBlue"} type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Создать аккаунт
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    Уже зарегистрированы?{' '}
                    <TextLink href={route('login')} tabIndex={6}>
                        Войти
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
