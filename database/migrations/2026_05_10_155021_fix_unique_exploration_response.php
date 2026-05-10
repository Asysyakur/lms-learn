<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('meeting_step_exploration_responses', function (Blueprint $table) {

            // hapus unique lama
            $table->dropUnique('mse_step_user_unique');

            // unique baru
            $table->unique(
                [
                    'meeting_step_id',
                    'user_id',
                    'mission_index'
                ],
                'mse_step_user_mission_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::table('meeting_step_exploration_responses', function (Blueprint $table) {

            $table->dropUnique('mse_step_user_mission_unique');

            $table->unique(
                [
                    'meeting_step_id',
                    'user_id'
                ],
                'mse_step_user_unique'
            );
        });
    }
};