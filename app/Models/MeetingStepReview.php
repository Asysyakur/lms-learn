<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MeetingStepReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'meeting_step_id',
        'review_prompt',
        'review_code1',
        'review_code2',
        'review_code_language',
    ];

    public function meetingStep(): BelongsTo
    {
        return $this->belongsTo(MeetingStep::class);
    }
}