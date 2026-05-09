<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MeetingStep extends Model
{
    use HasFactory;

    protected $fillable = [
        'meeting_id',
        'step_number',
        'step_type',
        'title',
        'description',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function meeting(): BelongsTo
    {
        return $this->belongsTo(Meeting::class);
    }

    public function observation(): HasOne
    {
        return $this->hasOne(MeetingStepObservation::class);
    }

    public function asks(): HasMany
    {
        return $this->hasMany(MeetingStepAsk::class)->orderBy('order');
    }

    public function exploration(): HasOne
    {
        return $this->hasOne(MeetingStepExploration::class);
    }

    public function practice(): HasOne
    {
        return $this->hasOne(MeetingStepPractice::class);
    }

    public function review(): HasOne
    {
        return $this->hasOne(MeetingStepReview::class);
    }

    public function reflection(): HasOne
    {
        return $this->hasOne(MeetingStepReflection::class);
    }

    public function observationResponses(): HasMany
    {
        return $this->hasMany(MeetingStepObservationResponse::class);
    }

    public function askResponses(): HasMany
    {
        return $this->hasMany(MeetingStepAskResponse::class);
    }

    public function explorationResponses(): HasMany
    {
        return $this->hasMany(MeetingStepExplorationResponse::class);
    }

    public function practiceResponses(): HasMany
    {
        return $this->hasMany(MeetingStepPracticeResponse::class);
    }

    public function reviewResponses(): HasMany
    {
        return $this->hasMany(MeetingStepReviewResponse::class);
    }

    public function reflectionResponses(): HasMany
    {
        return $this->hasMany(MeetingStepReflectionResponse::class);
    }

    public function practices()
    {
        return $this->hasMany(
            MeetingStepPractice::class,
            'meeting_step_id'
        );
    }
}
