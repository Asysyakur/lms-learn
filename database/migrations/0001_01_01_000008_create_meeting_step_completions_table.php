<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meeting_step_completions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meeting_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('step_number');
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unique(['meeting_id', 'user_id', 'step_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meeting_step_completions');
    }
};