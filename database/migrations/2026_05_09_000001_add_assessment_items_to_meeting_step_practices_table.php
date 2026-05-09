<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('meeting_step_practices', function (Blueprint $table) {
            $table->json('assessment_items')->nullable()->after('assessment_options');
        });
    }

    public function down(): void
    {
        Schema::table('meeting_step_practices', function (Blueprint $table) {
            $table->dropColumn('assessment_items');
        });
    }
};
