<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meeting_step_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meeting_id')->constrained()->cascadeOnDelete();
            $table->foreignId('meeting_step_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('response_type');
            $table->longText('response_text')->nullable();
            $table->json('response_payload')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unique(['meeting_step_id', 'user_id', 'response_type'], 'msr_step_user_type_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meeting_step_responses');
    }
};