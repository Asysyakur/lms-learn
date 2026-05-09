<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meeting_step_practices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meeting_step_id')->constrained()->cascadeOnDelete();
            $table->string('assessment_mode')->nullable();
            $table->text('assessment_question')->nullable();
            $table->json('assessment_options')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meeting_step_practices');
    }
};