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
        Schema::table('meeting_step_exploration_responses', function (Blueprint $table) {
            $table->integer('mission_index')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('meeting_step_exploration_responses', function (Blueprint $table) {
            $table->dropColumn('mission_index');
        });
    }
};
