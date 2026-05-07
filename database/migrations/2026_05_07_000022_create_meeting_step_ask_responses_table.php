<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meeting_step_ask_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meeting_id')->constrained()->cascadeOnDelete();
            $table->foreignId('meeting_step_id')->constrained()->cascadeOnDelete();
            $table->foreignId('meeting_step_ask_id')->constrained('meeting_step_asks')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->longText('answer_text')->nullable();
            $table->json('answer_payload')->nullable();
            $table->timestamp('answered_at')->nullable();
            $table->timestamps();

            $table->unique(['meeting_step_ask_id', 'user_id'], 'msask_user_unique');
            $table->index(['meeting_step_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meeting_step_ask_responses');
    }
};
