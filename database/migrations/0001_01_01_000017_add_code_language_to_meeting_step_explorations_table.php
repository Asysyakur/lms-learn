<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('meeting_step_explorations', function (Blueprint $table) {
            $table->string('code_language')->nullable()->after('exploration_mode');
        });
    }

    public function down(): void
    {
        Schema::table('meeting_step_explorations', function (Blueprint $table) {
            $table->dropColumn('code_language');
        });
    }
};
