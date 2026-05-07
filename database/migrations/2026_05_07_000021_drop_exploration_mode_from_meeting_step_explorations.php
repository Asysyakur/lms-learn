<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('meeting_step_explorations', function (Blueprint $table) {
            if (Schema::hasColumn('meeting_step_explorations', 'exploration_mode')) {
                $table->dropColumn('exploration_mode');
            }
        });
    }

    public function down(): void
    {
        Schema::table('meeting_step_explorations', function (Blueprint $table) {
            if (! Schema::hasColumn('meeting_step_explorations', 'exploration_mode')) {
                $table->string('exploration_mode')->nullable()->after('id');
            }
        });
    }
};
