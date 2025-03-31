<?php

namespace App\Models;

use App\Enums\Role as RoleEnum;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isProfileFilled(): bool
    {
        return $this->first_name
            && $this->last_name
            && $this->second_name
            && $this->organization
            && $this->position
            && $this->city
            && $this->country_id
            && $this->degree_id
            && $this->title_id
            && $this->phone;
    }

    public function conferences(): BelongsToMany
    {
        return $this->belongsToMany(Conference::class)
            ->using(ConferenceUser::class)
            ->withPivot('confirmed');
    }

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }

    public function hasRole(RoleEnum $role): bool
    {
        return $this->roles()->where('role_id', $role->value)->exists();
    }

    public function responsibilities(): BelongsToMany
    {
        return $this->belongsToMany(Conference::class, 'responsibilities', 'user_id', 'conference_id');
    }
}
