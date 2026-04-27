<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MeetingStep extends Model
{
    use HasFactory;

    protected $fillable = [
        'meeting_id',
        'step_number',
        'step_type',
        'title',
        'description',
        'instruction_text',
        'resource_type',
        'resource_url',
        'question_prompt',
        'exploration_mode',
        'exploration_prompt',
        'assessment_mode',
        'assessment_question',
        'assessment_options',
        'review_prompt',
        'reflection_question',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'assessment_options' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function meeting(): BelongsTo
    {
        return $this->belongsTo(Meeting::class);
    }
}
