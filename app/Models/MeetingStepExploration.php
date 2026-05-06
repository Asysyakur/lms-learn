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
        'code_language',
        'exploration_prompt',
        'materials',
        'case_studies',
    ];

    protected $casts = [
        'materials' => 'array',
        'case_studies' => 'array',
    ];

    public function meetingStep(): BelongsTo
    {
        return $this->belongsTo(MeetingStep::class);
    }
}
