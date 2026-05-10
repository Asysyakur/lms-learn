<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('meeting_step_reviews', function (Blueprint $table) {

            $table->dropColumn([
                'review_prompt',
                'review_code1',
                'review_code2',
                'review_code_language',
            ]);

            $table->longText('instruction_text')->nullable();

            $table->json('proof_questions')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('meeting_step_reviews', function (Blueprint $table) {

            $table->text('review_prompt')->nullable();

            $table->longText('review_code1')->nullable();

            $table->longText('review_code2')->nullable();

            $table->string('review_code_language')->nullable();

            $table->dropColumn([
                'instruction_text',
                'proof_questions',
            ]);
        });
    }
};