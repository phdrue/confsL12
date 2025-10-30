import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Eye, EyeOff } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface RegisterForm {
    email: string;
    password: string;
    password_confirmation: string;
}

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [policyAgreed, setPolicyAgreed] = useState(false);
    const [showPolicyDialog, setShowPolicyDialog] = useState(false);
    const [policyError, setPolicyError] = useState<string | null>(null);
    
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!policyAgreed) {
            setPolicyError('Вы должны согласиться с политикой конфиденциальности');
            return;
        }
        setPolicyError(null);
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
                                type={showPassword ? "text" : "password"}
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
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Подтверждение пароля</Label>
                        <div className="relative">
                            <Input
                                id="password_confirmation"
                                type={showPasswordConfirmation ? "text" : "password"}
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
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                tabIndex={-1}
                            >
                                {showPasswordConfirmation ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        <InputError message={errors.password_confirmation} />
                    </div>

                {/* Policy Agreement */}
                <div className="grid gap-2">
                    <div className="flex items-start mt-2">
                        <input
                            id="policy-agreement"
                            name="policy_agreement"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded cursor-pointer"
                            checked={policyAgreed}
                            tabIndex={7}
                            onChange={() => setShowPolicyDialog(true)}
                            readOnly
                            required
                        />
                        <label
                            htmlFor="policy-agreement"
                            className="ml-3 text-sm font-medium text-gray-700 cursor-pointer"
                            onClick={() => setShowPolicyDialog(true)}
                        >
                            Я согласен с{' '}
                            <span className="text-blue-600 hover:text-blue-500 underline">
                                политикой конфиденциальности
                            </span>
                        </label>
                    </div>
                    {policyError && <InputError message={policyError} />}
                </div>


                    <Button
                        variant={"brandDarkBlue"}
                        type="submit"
                        className="mt-2 w-full"
                        tabIndex={5}
                        disabled={processing || !policyAgreed}
                    >
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
            {/* Policy Dialog */}
            <Dialog open={showPolicyDialog} onOpenChange={setShowPolicyDialog}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            Согласие на обработку персональных данных субъектов персональных данных, которые являются посетителями официального сайта ФГБОУ ВО КГМУ Минздрава России
                        </DialogTitle>
                    </DialogHeader>
                    <div className="text-sm text-gray-700 space-y-4 max-h-[50vh] overflow-y-auto mt-2 mb-2 pr-2">
                        <p>
                            Я (далее - Пользователь или Субъект персональных данных) даю согласие ФГБОУ ВО КГМУ Минздрава России, адрес: 305041, Курская область, г. Курск, ул. К. Маркса, д.3, ИНН: 4629027572, ОГРН: 1034637005347 (далее – Оператор) на обработку моих персональных данных в соответствии с прочитанной мною Политикой обработки персональных данных в КГМУ (расположенной по адресу https://kurskmed.com/adm_files/politic_personal_data.pdf/, далее – Политика) при использовании сайта Оператора (расположенного по адресу https://confs.kurskmed.com/, далее - Сайт).
                        </p>
                        <p>
                            Согласие дается мной сознательно, свободно, своей волей и в своем интересе. Оператор собирает и обрабатывает персональные данные, необходимые для предоставления услуг, обеспечения безопасности и удобства Пользователя, контроля за соблюдением Пользователем правил использования Сайта, оказания Пользователю технической поддержки, сбора и обобщения статистических данных, проведения исследований, связи и иного применимого взаимодействия с Пользователем (далее — Взаимодействие).
                        </p>
                        <p>
                            Оператор вправе обрабатывать следующие персональные данные, полученные Оператором как путем заполнения Пользователем специальных форм, так и в некоторых случаях, собираемые сайтом автоматически, для следующих целей:
                        </p>
                        <p>
                            а) адрес электронной почты (email) — требуется Оператору для связи с Пользователем при предоставлении услуг и иных целей в соответствии с п. 4 Политики;
                        </p>
                        <p>
                            б) номер контактного телефона — требуется Оператору для связи с Пользователем при предоставлении услуг и иных целей в соответствии с п. 4 Политики;
                        </p>
                        <p>
                            в) ФИО — требуется Оператору для идентификации Пользователя в соответствии с п. 4 Политики;
                        </p>
                        <p>
                            г) должность — требуется Оператору для идентификации Пользователя в соответствии с п. 4 Политики;
                        </p>
                        <p>
                            д) ученая степень — требуется Оператору для идентификации Пользователя в соответствии с п. 4 Политики;
                        </p>
                        <p>
                            е) ученое звание - требуется Оператору для идентификации Пользователя в соответствии с п. 4 Политики.
                        </p>
                        <p>
                            Также целями обработки персональных данных Пользователя Оператором являются:
                        </p>
                        <p>
                            предоставление доступа к сервисам, информации, материалам, содержащимся на Сайте Оператора, оказание услуг, связь и взаимодействие, предоставление справочной информации, исследование и формирование обобщенного «портрета (профиля) пользователя» для совершенствования сервисов, сбора и обобщения статистических данных.
                        </p>
                        <p>
                            Согласие предоставляется на осуществление Оператором следующих действий с моими персональными данными: сбор, запись, систематизация, накопление, хранение, уточнение (обновление, изменение), извлечение, использование, передача (предоставление, доступ), обезличивание, блокирование, удаление, уничтожение, - с использованием средств автоматизации и без использования таких средств.
                        </p>
                        <p>
                            Настоящим я выражаю согласие на предоставление Оператором персональных данных третьим лицам, в случае: явного моего согласия; если передача необходима в рамках использования Сайта и в случае необходимости предоставления услуг Пользователю; если передача предусмотрена российским или иным применимым законодательством.
                        </p>
                        <p>
                            Срок действия согласия на обработку персональных данных является неограниченным. Согласие на обработку персональных данных в любой момент может быть отозвано Пользователем путем направления письменного обращения/требования Оператору по адресу: 305041, Курская область, г. Курск, ул. К. Маркса, д.3, с пометкой: «Отзыв согласия на обработку персональных данных» или «Требование о прекращении обработки персональных данных».
                        </p>
                        <p>
                            При этом я согласен, что отзыв согласия на обработку персональных данных, как и требование о прекращении обработки персональных данных, может повлечь за собой удаление моих учетных записей на Сайте Оператора в сети Интернет, невозможность идентификации меня в качестве пользователя Сайта, что означает невозможность его использования и получения услуг от Оператора.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            onClick={() => {
                                setPolicyAgreed(true);
                                setShowPolicyDialog(false);
                                setPolicyError(null);
                            }}
                            variant="brandDarkBlue"
                        >
                            Согласен
                        </Button>
                        <Button
                            type="button"
                            onClick={() => {
                                setPolicyAgreed(false);
                                setShowPolicyDialog(false);
                            }}
                            variant="outline"
                        >
                            Не согласен
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthLayout>
    );
}
