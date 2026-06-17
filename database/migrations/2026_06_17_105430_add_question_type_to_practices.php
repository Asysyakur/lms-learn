<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('meeting_step_practices', function (Blueprint $table) {
            $table->string('question_type')->default('text');
            $table->string('question_language')->nullable();
            $table->string('option_type')->default('text');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('meeting_step_practices', function (Blueprint $table) {
            $table->dropColumn(['question_type', 'question_language', 'option_type']);
        });
    }
};
