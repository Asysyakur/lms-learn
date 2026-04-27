<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MeetingStepExploration extends Model
{
    use HasFactory;

    protected $fillable = [
        'meeting_step_id',
        'exploration_mode',
        'exploration_prompt',
    ];

    public function meetingStep(): BelongsTo
    {
        return $this->belongsTo(MeetingStep::class);
    }
}