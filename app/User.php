<?php

namespace REBELinBLUE\Deployer;

use Illuminate\Auth\Authenticatable;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\Access\Authorizable;
use REBELinBLUE\Deployer\Presenters\UserPresenter;
use REBELinBLUE\Deployer\Traits\BroadcastChanges;
use Robbo\Presenter\PresentableInterface;

/**
 * User model.
 */
class User extends Model implements
    AuthenticatableContract,
    AuthorizableContract,
    CanResetPasswordContract,
    PresentableInterface
{
    use Authenticatable, CanResetPassword, Authorizable, SoftDeletes, BroadcastChanges;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'email', 'password', 'skin', 'language'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = ['deleted_at', 'updated_at', 'password', 'remember_token', 'google2fa_secret'];

    /**
     * Additional attributes to include in the JSON representation.
     *
     * @var array
     */
    protected $appends = ['has_two_factor_authentication'];

    /**
     * The attributes that should be casted to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
    ];

    /**
     * Generate a change email token.
     *
     * @return string
     */
    public function requestEmailToken()
    {
        $this->email_token = str_random(40);
        $this->save();

        return $this->email_token;
    }

    /**
     * Gets the view presenter.
     *
     * @return UserPresenter
     */
    public function getPresenter()
    {
        return new UserPresenter($this);
    }

    /**
     * A hack to allow avatar_url to be called on the result of Auth::user().
     *
     * @param  string $key The variable to get
     * @return mixed
     */
    public function __get($key)
    {
        if ($key === 'avatar_url') {
            return $this->getPresenter()->avatar_url;
        }

        return parent::__get($key);
    }

    /**
     * Determines whether the user has Google 2FA enabled.
     *
     * @return bool
     * @SuppressWarnings(PHPMD.BooleanGetMethodName)
     */
    public function getHasTwoFactorAuthenticationAttribute()
    {
        return !empty($this->google2fa_secret);
    }
}
