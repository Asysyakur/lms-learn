<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\MeetingStepResponse;
use App\Models\MeetingStepReflectionResponse;
use App\Models\MeetingStepPracticeResponse;
use App\Models\MeetingStepObservationResponse;
use App\Models\MeetingStepExplorationResponse;
use App\Models\MeetingStepReviewResponse;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
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

    public function quizAttempts(): HasMany
    {
        return $this->hasMany(QuizAttempt::class);
    }

    public function stepResponses()
    {
        return $this->hasMany(MeetingStepResponse::class, 'user_id');
    }

    public function askResponses()
    {
        return $this->hasMany(
            \App\Models\MeetingStepAskResponse::class,
            'user_id'
        );
    }
    
    public function reflectionResponses()
    {
        return $this->hasMany(
            MeetingStepReflectionResponse::class,
            'user_id'
        );
    }

    public function practiceResponses()
    {
        return $this->hasMany(
            MeetingStepPracticeResponse::class,
            'user_id'
        );
    }

    public function observationResponses()
    {
        return $this->hasMany(
            MeetingStepObservationResponse::class,
            'user_id'
        );
    }

    public function explorationResponses()
    {
        return $this->hasMany(
            MeetingStepExplorationResponse::class,
            'user_id'
        );
    }

    public function reviewResponses()
    {
        return $this->hasMany(
            MeetingStepReviewResponse::class,
            'user_id'
        );
    }
}
