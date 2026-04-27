<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

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

    public function ask(): HasOne
    {
        return $this->hasOne(MeetingStepAsk::class);
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
}
