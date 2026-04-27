<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MeetingStepObservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'meeting_step_id',
        'instruction_text',
        'resource_type',
        'resource_url',
    ];

    public function meetingStep(): BelongsTo
    {
        return $this->belongsTo(MeetingStep::class);
    }
}