<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'missions',
    ];

    protected $casts = [
        'materials' => 'array',
        'case_studies' => 'array',
        'missions' => 'array',
    ];

    public function meetingStep(): BelongsTo
    {
        return $this->belongsTo(MeetingStep::class);
    }

    public function responses(): HasMany
    {
        return $this->hasMany(MeetingStepExplorationResponse::class);
    }
}
