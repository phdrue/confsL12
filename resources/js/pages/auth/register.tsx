import { Head, useForm } from '@inertiajs/react';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

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
    [key: string]: string;
}

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [policyAgreed, setPolicyAgreed] = useState(false);

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
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                tabIndex={3}
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                                placeholder="Пароль"
                                className="pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Подтверждение пароля</Label>
                        <div className="relative">
                            <Input
                                id="password_confirmation"
                                type={showPasswordConfirmation ? 'text' : 'password'}
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                                placeholder="Подтверждение пароля"
                                className="pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                tabIndex={-1}
                            >
                                {showPasswordConfirmation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                        <InputError message={errors.password_confirmation} />
                    </div>

                    {/* Policy Agreement */}
                    <div className="grid gap-2">
                        <div className="mt-2 flex items-start">
                            <input
                                id="policy-agreement"
                                name="policy_agreement"
                                type="checkbox"
                                className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600"
                                checked={policyAgreed}
                                tabIndex={7}
                                onChange={(e) => setPolicyAgreed(e.target.checked)}
                                required
                            />
                            <label htmlFor="policy-agreement" className="ml-3 cursor-pointer text-sm font-medium text-gray-700">
                                Я выражаю своё <a href={route('download.sogl1')} target="_blank" className="text-blue-600 underline hover:text-blue-500">согласие на обработку</a> и <a href={route('download.sogl2')} target="_blank" className="text-blue-600 underline hover:text-blue-500">согласие на распространение</a> моих персональных данных в соответствии с
                                <a href="https://kurskmed.com/adm_files/politic_personal_data.pdf" target="_blank" className="text-blue-600 underline hover:text-blue-500">«Политикой обработки персональных данных в КГМУ»</a>
                            </label>
                        </div>
                        <InputError message={(errors as any).policy_agreement} />
                    </div>

                    <Button variant={'brandDarkBlue'} type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing || !policyAgreed}>
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
