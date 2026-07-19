<?php

namespace Tests\Feature;

use App\Models\QuizQuestion;
use App\Models\QuizSet;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuizAttemptTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_submit_quiz_once_and_score_is_saved(): void
    {
        $user = User::factory()->create();
        $quizSet = QuizSet::create([
            'title' => 'Pre-test',
            'slug' => 'pre-test',
            'quiz_type' => 'pre-test',
            'is_active' => true,
        ]);

        $firstQuestion = QuizQuestion::create([
            'quiz_set_id' => $quizSet->id,
            'question_text' => 'Question 1',
            'options' => ['One', 'Two'],
            'correct_option' => 'A',
            'sort_order' => 1,
        ]);
        $secondQuestion = QuizQuestion::create([
            'quiz_set_id' => $quizSet->id,
            'question_text' => 'Question 2',
            'options' => ['One', 'Two'],
            'correct_option' => 'B',
            'sort_order' => 2,
        ]);

        $this->actingAs($user)->get(route('tes.show', ['slug' => $quizSet->slug]));

        $response = $this->actingAs($user)->post(route('tes.submit', ['slug' => $quizSet->slug]), [
            'answers' => [
                $firstQuestion->id => 'A',
                $secondQuestion->id => 'A',
            ],
        ]);

        $response->assertRedirect(route('tes'));
        $this->assertDatabaseHas('quiz_attempts', [
            'quiz_set_id' => $quizSet->id,
            'user_id' => $user->id,
            'score' => 1,
            'total_questions' => 2,
            'percentage' => 50,
        ]);
    }

    public function test_user_cannot_submit_the_same_quiz_twice(): void
    {
        $user = User::factory()->create();
        $quizSet = QuizSet::create([
            'title' => 'Post-test',
            'slug' => 'post-test',
            'quiz_type' => 'post-test',
            'is_active' => true,
        ]);
        $question = QuizQuestion::create([
            'quiz_set_id' => $quizSet->id,
            'question_text' => 'Question',
            'options' => ['One', 'Two'],
            'correct_option' => 'A',
            'sort_order' => 1,
        ]);

        $this->actingAs($user)->get(route('tes.show', ['slug' => $quizSet->slug]));

        $this->actingAs($user)->post(route('tes.submit', ['slug' => $quizSet->slug]), [
            'answers' => [$question->id => 'A'],
        ]);

        $response = $this->actingAs($user)->post(route('tes.submit', ['slug' => $quizSet->slug]), [
            'answers' => [$question->id => 'B'],
        ]);

        $response->assertSessionHas('error');
        $this->assertDatabaseCount('quiz_attempts', 1);
        $this->assertDatabaseHas('quiz_attempts', [
            'quiz_set_id' => $quizSet->id,
            'user_id' => $user->id,
            'score' => 1,
        ]);
    }

    public function test_starting_a_quiz_records_started_at_and_keeps_it_on_revisit(): void
    {
        $user = User::factory()->create();
        $quizSet = QuizSet::create([
            'title' => 'Pre-test',
            'slug' => 'pre-test',
            'quiz_type' => 'pre-test',
            'duration_minutes' => 30,
            'is_active' => true,
        ]);

        $this->actingAs($user)->get(route('tes.show', ['slug' => $quizSet->slug]));

        $attempt = $quizSet->attempts()->where('user_id', $user->id)->first();
        $this->assertNotNull($attempt->started_at);

        $firstStartedAt = $attempt->started_at;

        $this->travel(5)->minutes();
        $response = $this->actingAs($user)->get(route('tes.show', ['slug' => $quizSet->slug]));

        $attempt->refresh();
        $this->assertTrue($attempt->started_at->equalTo($firstStartedAt));
        $response->assertInertia(fn ($page) => $page->where('remainingSeconds', 25 * 60));
    }

    public function test_user_cannot_open_another_quiz_while_one_is_running(): void
    {
        $user = User::factory()->create();
        $firstSet = QuizSet::create([
            'title' => 'Pre-test',
            'slug' => 'pre-test',
            'quiz_type' => 'pre-test',
            'is_active' => true,
        ]);
        $secondSet = QuizSet::create([
            'title' => 'Post-test',
            'slug' => 'post-test',
            'quiz_type' => 'post-test',
            'is_active' => true,
        ]);

        $this->actingAs($user)->get(route('tes.show', ['slug' => $firstSet->slug]));

        $response = $this->actingAs($user)->get(route('tes.show', ['slug' => $secondSet->slug]));

        $response->assertRedirect(route('tes'));
        $response->assertSessionHas('error');
        $this->assertDatabaseMissing('quiz_attempts', [
            'quiz_set_id' => $secondSet->id,
            'user_id' => $user->id,
        ]);
    }
}
