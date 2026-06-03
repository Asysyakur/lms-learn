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
        Schema::table('meeting_step_practice_responses', function (Blueprint $table) {
            $table->boolean('is_locked')->default(false);
        });
    }

    public function down(): void
    {
        Schema::table('meeting_step_practice_responses', function (Blueprint $table) {
            $table->dropColumn('is_locked');
        });
    }
};
