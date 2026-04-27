<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MeetingStepResponse extends Model
{
    use HasFactory;

    protected $fillable = [
        'meeting_id',
        'meeting_step_id',
        'user_id',
        'response_type',
        'response_text',
        'response_payload',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'response_payload' => 'array',
            'completed_at' => 'datetime',
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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}