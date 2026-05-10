<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MeetingStepReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'meeting_step_id',
        'instruction_text',
        'proof_questions',
    ];

    protected function casts(): array
    {
        return [
            'proof_questions' => 'array',
        ];
    }

    public function meetingStep(): BelongsTo
    {
        return $this->belongsTo(MeetingStep::class);
    }

    public function responses(): HasMany
    {
        return $this->hasMany(MeetingStepReviewResponse::class);
    }
}