<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuizAttempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_set_id',
        'user_id',
        'answers',
        'score',
        'total_questions',
        'percentage',
        'submitted_at',
    ];

    protected function casts(): array
    {
        return [
            'answers' => 'array',
            'percentage' => 'decimal:2',
            'submitted_at' => 'datetime',
        ];
    }

    public function quizSet(): BelongsTo
    {
        return $this->belongsTo(QuizSet::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
