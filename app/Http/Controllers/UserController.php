<?php

namespace App\Http\Controllers;

use App\Enums\Role;
use App\Http\Requests\CreateUserRequest;
use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/users/index', [
            'users' => User::with('roles')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateUserRequest $request)
    {
        User::create([
            ...$request->safe(),
            'password' => '111111',
            'email_verified_at' => now(),
        ]);
    }

    public function toggleResponsible(User $user)
    {
        if ($user->hasRole(Role::RESPONSIBLE)) {
            $user->roles()->detach(Role::RESPONSIBLE->value);
            $user->responsibilities()->detach();
        } else {
            $user->roles()->attach(Role::RESPONSIBLE->value);
        }

        return to_route('adm.users.index');
    }

    public function toggleAdmin(User $user)
    {
        if ($user->hasRole(Role::ADMIN)) {
            $user->roles()->detach(Role::ADMIN->value);
        } else {
            $user->roles()->attach(Role::ADMIN->value);
        }

        return to_route('adm.users.index');
    }

    public function toggleUser(User $user)
    {
        if ($user->hasRole(Role::USER)) {
            $user->roles()->detach(Role::USER->value);
        } else {
            $user->roles()->attach(Role::USER->value);
        }

        return to_route('adm.users.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }
}
