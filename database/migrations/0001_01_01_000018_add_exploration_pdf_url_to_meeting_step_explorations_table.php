<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('meeting_step_explorations', function (Blueprint $table) {
            $table->string('exploration_pdf_url')->nullable()->after('exploration_prompt');
        });
    }

    public function down(): void
    {
        Schema::table('meeting_step_explorations', function (Blueprint $table) {
            $table->dropColumn('exploration_pdf_url');
        });
    }
};
