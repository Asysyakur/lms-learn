<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('meeting_step_explorations', function (Blueprint $table) {
            if (! Schema::hasColumn('meeting_step_explorations', 'materials')) {
                $table->json('materials')->nullable()->after('exploration_pdf_url');
            }
            if (! Schema::hasColumn('meeting_step_explorations', 'case_studies')) {
                $table->json('case_studies')->nullable()->after('materials');
            }
        });
    }

    public function down(): void
    {
        Schema::table('meeting_step_explorations', function (Blueprint $table) {
            if (Schema::hasColumn('meeting_step_explorations', 'case_studies')) {
                $table->dropColumn('case_studies');
            }
            if (Schema::hasColumn('meeting_step_explorations', 'materials')) {
                $table->dropColumn('materials');
            }
        });
    }
};
