<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MeetingStepAskResponse extends Model
{
    use HasFactory;

    protected $fillable = [
        'meeting_id',
        'meeting_step_id',
        'meeting_step_ask_id',
        'user_id',
        'answer_text',
        'answer_payload',
        'answered_at',
    ];

    protected function casts(): array
    {
        return [
            'answer_payload' => 'array',
            'answered_at' => 'datetime',
        ];
    }

    public function meeting(): BelongsTo
    {
        return $this->belongsTo(Meeting::class);
    }

    public function meetingStep(): BelongsTo
    {
        return $this->belongsTo(MeetingStep::class);
    }

    public function ask(): BelongsTo
    {
        return $this->belongsTo(MeetingStepAsk::class, 'meeting_step_ask_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function step(): BelongsTo
    {
        return $this->belongsTo(MeetingStep::class, 'meeting_step_id');
    }
}
