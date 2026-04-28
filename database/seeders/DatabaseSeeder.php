<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Meeting;
use App\Models\MeetingStep;
use App\Models\MeetingStepAsk;
use App\Models\MeetingStepExploration;
use App\Models\MeetingStepObservation;
use App\Models\MeetingStepPractice;
use App\Models\MeetingStepReflection;
use App\Models\MeetingStepReview;
use App\Models\QuizQuestion;
use App\Models\QuizSet;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'role' => 'admin',
        ]);

        $course = Course::create([
            'title' => 'Materi OOP',
            'slug' => 'materi-oop',
            'description' => 'Belajar OOP lewat observasi, bertanya, eksplorasi, latihan, perbaikan, dan refleksi.',
            'cover_image' => '/images/learning-card.svg',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $meetingBlueprints = [
            [
                'meeting_number' => 1,
                'title' => 'Pertemuan 1',
                'description' => 'Mengenal konsep dasar OOP dan menganalisis contoh sederhana.',
                'exploration_mode' => 'analysis',
                'assessment_mode' => 'quiz',
            ],
            [
                'meeting_number' => 2,
                'title' => 'Pertemuan 2',
                'description' => 'Eksplorasi OOP dengan studi kasus dan praktik compile code.',
                'exploration_mode' => 'code_compile',
                'assessment_mode' => 'quiz',
            ],
            [
                'meeting_number' => 3,
                'title' => 'Pertemuan 3',
                'description' => 'Eksplorasi lanjutan dengan studi kasus dan compile code.',
                'exploration_mode' => 'code_compile',
                'assessment_mode' => 'essay',
            ],
        ];

        foreach ($meetingBlueprints as $blueprint) {
            $meeting = Meeting::create([
                'course_id' => $course->id,
                'meeting_number' => $blueprint['meeting_number'],
                'title' => $blueprint['title'],
                'description' => $blueprint['description'],
                'sort_order' => $blueprint['meeting_number'],
                'is_active' => true,
            ]);

            $steps = [
                [
                    'step_number' => 1,
                    'step_type' => 'observe',
                    'title' => 'Mari Mengamati',
                    'description' => 'Lihat PPT atau video yang sudah disiapkan.',
                    'instruction_text' => 'Buka PPT atau video terlebih dahulu untuk memahami materi awal.',
                    'resource_type' => 'both',
                    'resource_url' => '/images/learning-card.svg',
                ],
                [
                    'step_number' => 2,
                    'step_type' => 'ask',
                    'title' => 'Ayo Bertanya',
                    'description' => 'Tulis pertanyaan atau tanggapanmu setelah melihat PPT/video.',
                    'question_prompt' => 'Apa yang belum kamu pahami dari PPT atau video pada pertemuan ini?',
                ],
                [
                    'step_number' => 3,
                    'step_type' => 'exploration',
                    'title' => 'Eksplorasi',
                    'description' => 'Isi sesuai instruksi khusus tiap pertemuan.',
                    'exploration_mode' => $blueprint['exploration_mode'],
                    'code_language' => $blueprint['exploration_mode'] === 'code_compile' ? 'javascript' : null,
                    'exploration_prompt' => $blueprint['exploration_mode'] === 'analysis'
                        ? 'Analisis studi kasus berikut dan tulis hasil pengamatanmu.'
                        : 'Compile codingan berikut dan jelaskan hasil yang muncul.',
                ],
                [
                    'step_number' => 4,
                    'step_type' => 'practice',
                    'title' => 'Latihan Soal',
                    'description' => 'Kerjakan kuis pilihan ganda atau essay sesuai pertemuan.',
                    'assessment_mode' => $blueprint['assessment_mode'],
                    'assessment_question' => $blueprint['assessment_mode'] === 'essay'
                        ? 'Jelaskan secara singkat penerapan konsep OOP pada studi kasus ini.'
                        : 'Pilih jawaban yang paling tepat tentang konsep OOP berikut.',
                    'assessment_options' => $blueprint['assessment_mode'] === 'quiz'
                        ? [
                            'A. OOP berfokus pada objek.',
                            'B. OOP hanya memakai fungsi.',
                            'C. OOP tidak mengenal class.',
                            'D. OOP hanya untuk desain UI.',
                        ]
                        : null,
                ],
                [
                    'step_number' => 5,
                    'step_type' => 'review',
                    'title' => 'Bandingkan dan Perbaiki',
                    'description' => 'Bandingkan jawaban eksplorasi dan edit jika perlu.',
                    'review_prompt' => 'Tinjau jawaban eksplorasimu lalu perbaiki jika ada bagian yang kurang tepat.',
                ],
                [
                    'step_number' => 6,
                    'step_type' => 'reflection',
                    'title' => 'Refleksi',
                    'description' => 'Jawab pertanyaan penutup tentang pertemuan ini.',
                    'reflection_question' => 'Apa hal paling penting yang kamu pelajari pada pertemuan ini?',
                ],
            ];

            foreach ($steps as $step) {
                $meetingStep = MeetingStep::create([
                    'meeting_id' => $meeting->id,
                    'step_number' => $step['step_number'],
                    'step_type' => $step['step_type'],
                    'title' => $step['title'],
                    'description' => $step['description'],
                    'sort_order' => $step['step_number'],
                    'is_active' => true,
                ]);

                match ($step['step_type']) {
                    'observe' => MeetingStepObservation::create([
                        'meeting_step_id' => $meetingStep->id,
                        'instruction_text' => $step['instruction_text'],
                        'resource_type' => $step['resource_type'],
                        'resource_url' => $step['resource_url'],
                    ]),
                    'ask' => MeetingStepAsk::create([
                        'meeting_step_id' => $meetingStep->id,
                        'question_prompt' => $step['question_prompt'],
                    ]),
                    'exploration' => MeetingStepExploration::create([
                        'meeting_step_id' => $meetingStep->id,
                        'exploration_mode' => $step['exploration_mode'],
                        'code_language' => $step['code_language'],
                        'exploration_prompt' => $step['exploration_prompt'],
                    ]),
                    'practice' => MeetingStepPractice::create([
                        'meeting_step_id' => $meetingStep->id,
                        'assessment_mode' => $step['assessment_mode'],
                        'assessment_question' => $step['assessment_question'],
                        'assessment_options' => $step['assessment_options'],
                    ]),
                    'review' => MeetingStepReview::create([
                        'meeting_step_id' => $meetingStep->id,
                        'review_prompt' => $step['review_prompt'],
                    ]),
                    'reflection' => MeetingStepReflection::create([
                        'meeting_step_id' => $meetingStep->id,
                        'reflection_question' => $step['reflection_question'],
                    ]),
                    default => null,
                };
            }
        }

        $quizSets = [
            [
                'title' => 'Pre-test',
                'slug' => 'pre-test',
                'quiz_type' => 'pre-test',
                'description' => 'Uji pemahaman awal sebelum masuk materi utama.',
                'cover_image' => '/images/pretest-card.svg',
                'questions' => [
                    ['question' => 'Apa kepanjangan dari OOP?', 'options' => ['Object Oriented Programming', 'Open Online Platform', 'Output Operation Program', 'Object Output Process'], 'answer' => 'A'],
                    ['question' => 'Dalam OOP, class digunakan untuk apa?', 'options' => ['Menyimpan file', 'Membuat objek', 'Menghapus database', 'Menjalankan server'], 'answer' => 'B'],
                    ['question' => 'Contoh konsep utama OOP adalah...', 'options' => ['Inheritance', 'Sorting', 'Looping', 'Printing'], 'answer' => 'A'],
                ],
            ],
            [
                'title' => 'Post-test',
                'slug' => 'post-test',
                'quiz_type' => 'post-test',
                'description' => 'Cek hasil belajar setelah menyelesaikan seluruh materi.',
                'cover_image' => '/images/posttest-card.svg',
                'questions' => [
                    ['question' => 'Apa fungsi inheritance dalam OOP?', 'options' => ['Mewarisi sifat dari class lain', 'Menghapus objek', 'Menyimpan array', 'Mengubah warna UI'], 'answer' => 'A'],
                    ['question' => 'Encapsulation bertujuan untuk...', 'options' => ['Menyembunyikan detail internal', 'Mencetak data', 'Menjalankan fungsi random', 'Menggandakan class'], 'answer' => 'A'],
                    ['question' => 'Polymorphism berarti...', 'options' => ['Satu bentuk data', 'Banyak bentuk perilaku', 'Satu file dengan banyak folder', 'Banyak server'], 'answer' => 'B'],
                ],
            ],
        ];

        foreach ($quizSets as $quizSetData) {
            $questions = $quizSetData['questions'];
            unset($quizSetData['questions']);

            $quizSet = QuizSet::create($quizSetData + ['sort_order' => 1, 'is_active' => true]);

            foreach ($questions as $index => $question) {
                QuizQuestion::create([
                    'quiz_set_id' => $quizSet->id,
                    'question_text' => $question['question'],
                    'options' => $question['options'],
                    'correct_option' => $question['answer'],
                    'sort_order' => $index + 1,
                ]);
            }
        }
    }
}
