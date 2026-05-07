<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MeetingStepReflection extends Model
{
    use HasFactory;

    protected $fillable = [
        'meeting_step_id',
        'reflection_question',
    ];

    public function meetingStep(): BelongsTo
    {
        return $this->belongsTo(MeetingStep::class);
    }

    public function responses(): HasMany
    {
        return $this->hasMany(MeetingStepReflectionResponse::class);
    }
}