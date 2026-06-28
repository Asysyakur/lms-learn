<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('meeting_step_reflection_responses', function (Blueprint $table) {
            $table->longText('feedback')->nullable()->after('reflection_payload');
        });
    }

    public function down(): void
    {
        Schema::table('meeting_step_reflection_responses', function (Blueprint $table) {
            $table->dropColumn('feedback');
        });
    }
};
