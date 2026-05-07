<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MeetingStepObservationResponse extends Model
{
    use HasFactory;

    protected $fillable = [
        'meeting_id',
        'meeting_step_id',
        'user_id',
        'observation_text',
        'observation_payload',
        'observed_at',
    ];

    protected function casts(): array
    {
        return [
            'observation_payload' => 'array',
            'observed_at' => 'datetime',
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
