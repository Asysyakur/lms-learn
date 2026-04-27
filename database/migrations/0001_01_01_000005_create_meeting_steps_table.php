<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meeting_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meeting_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('step_number');
            $table->string('step_type');
            $table->string('title');
            $table->text('description')->nullable();
            $table->text('instruction_text')->nullable();
            $table->string('resource_type')->nullable();
            $table->string('resource_url')->nullable();
            $table->text('question_prompt')->nullable();
            $table->string('exploration_mode')->nullable();
            $table->text('exploration_prompt')->nullable();
            $table->string('assessment_mode')->nullable();
            $table->text('assessment_question')->nullable();
            $table->json('assessment_options')->nullable();
            $table->text('review_prompt')->nullable();
            $table->text('reflection_question')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meeting_steps');
    }
};
