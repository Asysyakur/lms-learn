<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MeetingStepPractice extends Model
{
    use HasFactory;

    protected $fillable = [
        'meeting_step_id',
        'assessment_mode',
        'assessment_question',
        'assessment_options',
        'assessment_items',
    ];

    protected function casts(): array
    {
        return [
            'assessment_options' => 'array',
            'assessment_items' => 'array',
        ];
    }

    public function meetingStep(): BelongsTo
    {
        return $this->belongsTo(MeetingStep::class);
    }

    public function responses(): HasMany
    {
        return $this->hasMany(MeetingStepPracticeResponse::class);
    }
}
