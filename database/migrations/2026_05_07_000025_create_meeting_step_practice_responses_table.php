<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meeting_step_practice_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meeting_id')->constrained()->cascadeOnDelete();
            $table->foreignId('meeting_step_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->longText('practice_text')->nullable();
            $table->json('practice_payload')->nullable();
            $table->timestamp('practiced_at')->nullable();
            $table->timestamps();

            $table->unique(['meeting_step_id', 'user_id'], 'msp_step_user_unique');
            $table->index(['meeting_step_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meeting_step_practice_responses');
    }
};
