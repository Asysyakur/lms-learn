<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('meeting_step_reviews', function (Blueprint $table) {
            if (! Schema::hasColumn('meeting_step_reviews', 'review_items')) {
                $table->json('review_items')->nullable()->after('instruction_text');
            }
        });

        if (Schema::hasColumn('meeting_step_reviews', 'proof_questions')) {
            DB::table('meeting_step_reviews')
                ->whereNull('review_items')
                ->orderBy('id')
                ->chunkById(100, function ($rows) {
                    foreach ($rows as $row) {
                        if (! empty($row->proof_questions)) {
                            DB::table('meeting_step_reviews')
                                ->where('id', $row->id)
                                ->update([
                                    'review_items' => $row->proof_questions,
                                ]);
                        }
                    }
                });
        }
    }

    public function down(): void
    {
        Schema::table('meeting_step_reviews', function (Blueprint $table) {
            if (Schema::hasColumn('meeting_step_reviews', 'review_items')) {
                $table->dropColumn('review_items');
            }
        });
    }
};