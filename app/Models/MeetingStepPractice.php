<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MeetingStepPractice extends Model
{
    use HasFactory;

    protected $fillable = [
        'meeting_step_id',
        'assessment_mode',
        'assessment_question',
        'assessment_options',
    ];

    protected function casts(): array
    {
        return [
            'assessment_options' => 'array',
        ];
    }

    public function meetingStep(): BelongsTo
    {
        return $this->belongsTo(MeetingStep::class);
    }
}