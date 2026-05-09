<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MeetingStepReviewResponse extends Model
{
    use HasFactory;

    protected $fillable = [
        'meeting_id',
        'meeting_step_id',
        'user_id',
        'review_text',
        'review_payload',
        'reviewed_at',
    ];

    protected function casts(): array
    {
        return [
            'review_payload' => 'array',
            'reviewed_at' => 'datetime',
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

    public function step()
    {
        return $this->belongsTo(
            MeetingStep::class,
            'meeting_step_id'
        );
    }
}
