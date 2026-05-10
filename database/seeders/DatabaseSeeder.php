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
            'description' => 'Belajar OOP lewat observasi, bertanya, eksplorasi, latihan, pembuktian, dan refleksi.',
            'cover_image' => '/images/learning-card.svg',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $meetingBlueprints = [
            [
                'meeting_number' => 1,
                'title' => 'Pertemuan 1',
                'description' => 'Mengenal konsep dasar OOP dan menganalisis contoh sederhana.',
                'code_language' => null,
                'assessment_mode' => 'quiz',
            ],
            [
                'meeting_number' => 2,
                'title' => 'Pertemuan 2',
                'description' => 'Eksplorasi OOP dengan studi kasus dan praktik compile code.',
                'code_language' => 'javascript',
                'assessment_mode' => 'quiz',
            ],
            [
                'meeting_number' => 3,
                'title' => 'Pertemuan 3',
                'description' => 'Eksplorasi lanjutan dengan studi kasus dan compile code.',
                'code_language' => 'javascript',
                'assessment_mode' => 'essay',
            ],
        ];

        foreach ($meetingBlueprints as $blueprint) {

            $meeting = Meeting::create([
                'course_id' => $course->id,
                'meeting_number' => $blueprint['meeting_number'],
                'title' => $blueprint['title'],
                'description' => $blueprint['description'],
                'cover_image' => '/images/learning-card.svg',
                'sort_order' => $blueprint['meeting_number'],
                'is_active' => true,
            ]);

            $steps = [

                /*
                |--------------------------------------------------------------------------
                | STEP 1 - OBSERVE
                |--------------------------------------------------------------------------
                */

                [
                    'step_number' => 1,
                    'step_type' => 'observe',
                    'title' => 'Mari Mengamati',
                    'description' => 'Lihat PPT atau video yang sudah disiapkan.',
                    'instruction_text' =>
                    'Buka PPT atau video terlebih dahulu untuk memahami materi awal.',
                    'resource_type' => 'both',
                    'resource_url' => '/images/learning-card.svg',
                ],

                /*
                |--------------------------------------------------------------------------
                | STEP 2 - ASK
                |--------------------------------------------------------------------------
                */

                [
                    'step_number' => 2,
                    'step_type' => 'ask',
                    'title' => 'Ayo Bertanya',
                    'description' =>
                    'Tulis pertanyaan atau tanggapanmu setelah melihat PPT/video.',
                    'question_prompt' =>
                    'Apa yang belum kamu pahami dari PPT atau video pada pertemuan ini?',
                ],

                /*
                |--------------------------------------------------------------------------
                | STEP 3 - EXPLORATION
                |--------------------------------------------------------------------------
                */

                [
                    'step_number' => 3,
                    'step_type' => 'exploration',
                    'title' => 'Eksplorasi',
                    'description' =>
                    'Isi sesuai instruksi khusus tiap pertemuan.',
                    'code_language' => $blueprint['code_language'],
                    'exploration_prompt' =>

                    $blueprint['code_language']
                        ? 'Compile codingan berikut dan jelaskan hasil yang muncul.'
                        : 'Analisis studi kasus berikut dan tulis hasil pengamatanmu.',
                ],

                /*
                |--------------------------------------------------------------------------
                | STEP 4 - PRACTICE
                |--------------------------------------------------------------------------
                */

                [
                    'step_number' => 4,
                    'step_type' => 'practice',
                    'title' => 'Latihan Soal',
                    'description' =>
                    'Kerjakan latihan soal berikut.',

                    'assessment_items' => [

                        [
                            'mode' => 'essay',

                            'question' =>
                            'Apa perbedaan utama antara program prosedural dan PBO dalam mengelola data dan fungsi?',

                            'options' => [],
                        ],

                        [
                            'mode' => 'essay',

                            'question' =>
                            'Berdasarkan pengamatanmu tadi, ketika program PBO menjalankan sebuah aksi siapa yang selalu menjadi pusat perhatiannya? Gunakan jawabanmu untuk menjelaskan apa yang membedakan fokus PBO dari prosedural!',

                            'options' => [],
                        ],

                        [
                            'mode' => 'essay',

                            'question' =>
                            'Apa itu pemrograman berorientasi objek?',

                            'options' => [],
                        ],
                    ],
                ],

                /*
                |--------------------------------------------------------------------------
                | STEP 5 - REVIEW / PEMBUKTIAN
                |--------------------------------------------------------------------------
                */

                [
                    'step_number' => 5,
                    'step_type' => 'review',
                    'title' => 'Pembuktian',

                    'description' =>
                    'Kembangkan jawaban latihan soal dengan argumen dan bukti.',

                    'instruction_text' => '

Buka halaman Pembuktian pada website OopCode.

Pada halaman ini akan ditampilkan jawaban yang telah kalian buat pada aktivitas Latihan Soal.

Tugas kalian sekarang adalah mengembangkan jawaban tersebut dengan menambahkan argumen pendukung.

Artinya, kalian tidak perlu mengubah jawaban sebelumnya, tetapi melengkapinya dengan alasan, bukti hasil pengamatan baik berupa tulisan atau screen capture, serta penjelasan yang memperkuat jawaban tersebut.

Dalam presentasi, setiap kelompok perlu:

• Menjelaskan apakah hipotesis awal didukung oleh hasil temuan yang diperoleh.

• Menyampaikan argumen secara runtut, jelas, dan berdasarkan hasil pengamatan serta pemahaman selama kegiatan.

                    ',

                    'proof_questions' => [

                        [
                            'question' =>

                            'Masalah apa yang muncul pada program prosedural yang dapat diatasi dengan pendekatan PBO melalui perbedaan pengelolaan data dan fungsi? Sertakan bukti untuk menguatkan jawabanmu!',
                        ],

                        [
                            'question' =>

                            'Apa manfaat dari fokus objek dalam PBO dibanding prosedural dalam menjalankan program? Sertakan bukti hasil pengamatanmu!',
                        ],

                        [
                            'question' =>

                            'Jelaskan bagaimana PBO dapat membantu mengatasi masalah pada program prosedural dan memudahkan pengembangan program yang semakin kompleks.',
                        ],
                    ],
                ],

                /*
                |--------------------------------------------------------------------------
                | STEP 6 - REFLECTION
                |--------------------------------------------------------------------------
                */

                [
                    'step_number' => 6,
                    'step_type' => 'reflection',
                    'title' => 'Refleksi',

                    'description' =>
                    'Jawab pertanyaan penutup tentang pertemuan ini.',

                    'reflection_question' =>
                    'Apa hal paling penting yang kamu pelajari pada pertemuan ini?',
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

                    /*
                    |--------------------------------------------------------------------------
                    | OBSERVE
                    |--------------------------------------------------------------------------
                    */

                    'observe' => MeetingStepObservation::create([
                        'meeting_step_id' => $meetingStep->id,
                        'instruction_text' =>
                        $step['instruction_text'],
                        'resource_type' =>
                        $step['resource_type'],
                        'resource_url' =>
                        $step['resource_url'],
                    ]),

                    /*
                    |--------------------------------------------------------------------------
                    | ASK
                    |--------------------------------------------------------------------------
                    */

                    'ask' => MeetingStepAsk::create([
                        'meeting_step_id' => $meetingStep->id,
                        'question_prompt' =>
                        $step['question_prompt'],
                        'order' => 1,
                    ]),

                    /*
                    |--------------------------------------------------------------------------
                    | EXPLORATION
                    |--------------------------------------------------------------------------
                    */

                    'exploration' => MeetingStepExploration::create([
                        'meeting_step_id' => $meetingStep->id,
                        'code_language' =>
                        $step['code_language'],
                        'exploration_prompt' =>
                        $step['exploration_prompt'],
                    ]),

                    /*
                    |--------------------------------------------------------------------------
                    | PRACTICE
                    |--------------------------------------------------------------------------
                    */

                    'practice' => collect(
                        $step['assessment_items']
                    )->each(function ($practice)
                    use ($meetingStep) {

                        MeetingStepPractice::create([

                            'meeting_step_id' =>
                            $meetingStep->id,

                            'assessment_mode' =>
                            $practice['mode'],

                            'assessment_question' =>
                            $practice['question'],

                            'assessment_options' =>
                            $practice['options'] ?? [],
                        ]);
                    }),

                    /*
                    |--------------------------------------------------------------------------
                    | REVIEW / PEMBUKTIAN
                    |--------------------------------------------------------------------------
                    */

                    'review' => MeetingStepReview::create([

                        'meeting_step_id' =>
                        $meetingStep->id,

                        'instruction_text' =>
                        $step['instruction_text'],

                        'proof_questions' =>
                        $step['proof_questions'],
                    ]),

                    /*
                    |--------------------------------------------------------------------------
                    | REFLECTION
                    |--------------------------------------------------------------------------
                    */

                    'reflection' => MeetingStepReflection::create([
                        'meeting_step_id' =>
                        $meetingStep->id,

                        'reflection_question' =>
                        $step['reflection_question'],
                    ]),

                    default => null,
                };
            }
        }

        /*
        |--------------------------------------------------------------------------
        | QUIZ
        |--------------------------------------------------------------------------
        */

        $quizSets = [

            [
                'title' => 'Pre-test',
                'slug' => 'pre-test',
                'quiz_type' => 'pre-test',

                'description' =>
                'Uji pemahaman awal sebelum masuk materi utama.',

                'cover_image' =>
                '/images/pretest-card.svg',

                'questions' => [

                    [
                        'question' =>
                        'Apa kepanjangan dari OOP?',

                        'options' => [
                            'Object Oriented Programming',
                            'Open Online Platform',
                            'Output Operation Program',
                            'Object Output Process',
                        ],

                        'answer' => 'A',
                    ],

                    [
                        'question' =>
                        'Dalam OOP, class digunakan untuk apa?',

                        'options' => [
                            'Menyimpan file',
                            'Membuat objek',
                            'Menghapus database',
                            'Menjalankan server',
                        ],

                        'answer' => 'B',
                    ],

                    [
                        'question' =>
                        'Contoh konsep utama OOP adalah...',

                        'options' => [
                            'Inheritance',
                            'Sorting',
                            'Looping',
                            'Printing',
                        ],

                        'answer' => 'A',
                    ],
                ],
            ],

            [
                'title' => 'Post-test',
                'slug' => 'post-test',
                'quiz_type' => 'post-test',

                'description' =>
                'Cek hasil belajar setelah menyelesaikan seluruh materi.',

                'cover_image' =>
                '/images/posttest-card.svg',

                'questions' => [

                    [
                        'question' =>
                        'Apa fungsi inheritance dalam OOP?',

                        'options' => [
                            'Mewarisi sifat dari class lain',
                            'Menghapus objek',
                            'Menyimpan array',
                            'Mengubah warna UI',
                        ],

                        'answer' => 'A',
                    ],

                    [
                        'question' =>
                        'Encapsulation bertujuan untuk...',

                        'options' => [
                            'Menyembunyikan detail internal',
                            'Mencetak data',
                            'Menjalankan fungsi random',
                            'Menggandakan class',
                        ],

                        'answer' => 'A',
                    ],

                    [
                        'question' =>
                        'Polymorphism berarti...',

                        'options' => [
                            'Satu bentuk data',
                            'Banyak bentuk perilaku',
                            'Satu file dengan banyak folder',
                            'Banyak server',
                        ],

                        'answer' => 'B',
                    ],
                ],
            ],
        ];

        foreach ($quizSets as $quizSetData) {

            $questions = $quizSetData['questions'];

            unset($quizSetData['questions']);

            $quizSet = QuizSet::create(
                $quizSetData + [
                    'sort_order' => 1,
                    'is_active' => true,
                ]
            );

            foreach ($questions as $index => $question) {

                QuizQuestion::create([

                    'quiz_set_id' =>
                    $quizSet->id,

                    'question_text' =>
                    $question['question'],

                    'options' =>
                    $question['options'],

                    'correct_option' =>
                    $question['answer'],

                    'sort_order' =>
                    $index + 1,
                ]);
            }
        }
    }
}