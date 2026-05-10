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
        Schema::table('meeting_step_explorations', function (Blueprint $table) {

            $table->string('exploration_mode')
                ->default('analysis');

            $table->json('case_studies')
                ->nullable();

            $table->json('missions')
                ->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('meeting_step_explorations', function (Blueprint $table) {
            $table->dropColumn('exploration_mode');
            $table->dropColumn('case_studies');
            $table->dropColumn('missions');
        });
    }
};
