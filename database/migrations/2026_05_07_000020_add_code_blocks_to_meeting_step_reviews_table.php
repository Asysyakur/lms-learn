<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('meeting_step_reviews', function (Blueprint $table) {
            if (!Schema::hasColumn('meeting_step_reviews', 'review_code1')) {
                $table->longText('review_code1')->nullable()->after('review_prompt');
            }
            if (!Schema::hasColumn('meeting_step_reviews', 'review_code2')) {
                $table->longText('review_code2')->nullable()->after('review_code1');
            }
            if (!Schema::hasColumn('meeting_step_reviews', 'review_code_language')) {
                $table->string('review_code_language')->nullable()->default('javascript')->after('review_code2');
            }
        });
    }

    public function down(): void
    {
        Schema::table('meeting_step_reviews', function (Blueprint $table) {
            if (Schema::hasColumn('meeting_step_reviews', 'review_code_language')) {
                $table->dropColumn('review_code_language');
            }
            if (Schema::hasColumn('meeting_step_reviews', 'review_code2')) {
                $table->dropColumn('review_code2');
            }
            if (Schema::hasColumn('meeting_step_reviews', 'review_code1')) {
                $table->dropColumn('review_code1');
            }
        });
    }
};
