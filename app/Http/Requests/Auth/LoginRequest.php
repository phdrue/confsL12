<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    // public function authenticate(): void
    // {
    //     $this->ensureIsNotRateLimited();

    //     if (! Auth::attempt($this->only('email', 'password'), $this->boolean('remember'))) {
    //         RateLimiter::hit($this->throttleKey());

    //         throw ValidationException::withMessages([
    //             'email' => __('auth.failed'),
    //         ]);
    //     }

    //     RateLimiter::clear($this->throttleKey());
    // }

    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $email = $this->only('email')['email'];
        $password = $this->only('password')['password'];

        $prefix = explode('@', $email)[0];
        $postfix = explode('@', $email)[1];

        //корп
        if ($postfix == 'kursksmu.net') {

            $user = User::where('email', $email)->first();
            if (is_null($user)) {
                RateLimiter::hit($this->throttleKey());
                throw ValidationException::withMessages([
                    'email' => 'Обратитесь к администратору для получения учетной записи',
                ]);
            }

            $ldap_authed = $this->ldap_auth($email, $password);
            if (!$ldap_authed) {
                RateLimiter::hit($this->throttleKey());
                throw ValidationException::withMessages([
                    'email' => trans('auth.failed'),
                ]);
            }

            Auth::login($user);
        } else {
            if (! Auth::attempt($this->only('email', 'password'), $this->boolean('remember'))) {
                RateLimiter::hit($this->throttleKey());

                throw ValidationException::withMessages([
                    'email' => trans('auth.failed'),
                ]);
            }
        }

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => __('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('email')) . '|' . $this->ip());
    }

    protected function ldap_auth($email, $password)
    {
        try {
            $dn = 'cn=ldapadmin,dc=kursksmu,dc=net';
            $admpassword = '1q2w3e$RA';

            $ldaphost = "10.0.0.106";
            $ldapport = "389";

            $ldap_con = ldap_connect($ldaphost, $ldapport) or die("Cant connect to LDAP Server");
        } catch (\Exception $exception) {
            return false;
            //return back()->with('error', 'Невозможно подключиться к LDAP серверу. Пожалуйста, попробуйте авторизоваться позднее или свяжитесь с администрацией портала.' . '</br>' . $exception->getMessage())->withInput();
        }

        try {
            //Включаем LDAP протокол версии 3
            ldap_set_option($ldap_con, LDAP_OPT_PROTOCOL_VERSION, 3);

            // устанавливаем ключ следовать ли автоматическим рефрерралам LDAP
            ldap_set_option($ldap_con, LDAP_OPT_REFERRALS, 0) or die('Unable to set LDAP opt referrals');

            // Пытаемся войти в LDAP при помощи введенных логина и пароля
            $bind = ldap_bind($ldap_con, $dn, $admpassword) ?? false;
        } catch (\Exception $exception) {
            return false;
            //            return back()->with('error', 'Произошёл сбой при авторизации LDAP. Пожалуйста, попробуйте авторизоваться позднее или свяжитесь с администрацией портала.'
            //                . '</br>' . $exception->getMessage())->withInput();
        }

        try {
            //Работа с LDAPOM
            if ($bind) {
                // фильтр по uid
                //                    $uid_filter = '(uid=' . $user_login . ')';
                // фильтр по email
                $email_filter = '(&(objectclass=*)(mail=' . $email . '))';

                $password_hash = '{SHA}' . base64_encode(sha1($password, TRUE));

                // ищем пользователя
                $result = ldap_search($ldap_con, 'dc=kursksmu,dc=net', $email_filter) or exit('no search');
                $searchresult = ldap_get_entries($ldap_con, $result);

                if ($searchresult['count'] == 0) {
                    return false;
                    //return back()->with('error','Вас нет в LDAP, обратитесь в 302 кабинет в стомат. корпусе');
                }

                if ($searchresult[0]['userpassword'][0] !== $password_hash) {
                    return false;
                    //return back()->with('error','Неверный пароль!!!');
                }

                return true;
            }
            //end РАБОТА С ЛДАПОМ
            else {
                return false;
                //return back()->with('error', 'Неправильный логин или пароль')->withInput();
            }
        } catch (\Exception $exception) {
            return false;
            //            return back()->with('error', 'Произошёл сбой при проверке пользователя. Пожалуйста, попробуйте авторизоваться позднее или свяжитесь с администрацией портала.'
            //                . '</br>' . $exception->getMessage())->withInput();
        }
    }
}
