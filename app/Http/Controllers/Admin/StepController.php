<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Meeting;
use App\Models\MeetingStep;
use App\Models\MeetingStepCompletion;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use App\Models\MeetingStepPracticeResponse;

class StepController extends Controller
{
    public function index($meetingId)
    {
        $steps = MeetingStep::with([
            'observation',
            'asks',
            'exploration',
            'practices',
            'review',
            'reflection'
        ])
            ->where('meeting_id', $meetingId)
            ->orderBy('step_number')
            ->get();

        return Inertia::render('Admin/Steps/Index', [
            'steps' => $steps,
            'meetingId' => $meetingId
        ]);
    }

    public function store(Request $request)
    {
        $rules = [
            'meeting_id' => 'required',
            'step_number' => 'required|numeric',
            'step_type' => 'required|in:observe,ask,exploration,practice,review,reflection',
            'title' => 'required',
        ];

        // Only validate image files if not using axios FormData with exploration
        if ($request->step_type !== 'exploration') {
            $rules['materials'] = 'nullable';
            $rules['materials.*.blocks.*.image_file'] = 'nullable|image|max:2048';
        } else {
            // For exploration with axios FormData, validate files separately
            $rules['materials'] = 'nullable';
        }

        $request->validate($rules);

        $step = MeetingStep::create($request->only([
            'meeting_id',
            'step_number',
            'step_type',
            'title',
            'description',
        ]));

        $this->handleStepType($step, $request);

        return redirect()->route('admin.meetings.steps', ['meeting' => $request->meeting_id])->with('success', 'Step berhasil ditambahkan');
    }

    public function edit(MeetingStep $step)
    {
        $step->load([
            'meeting.steps.practices',
            'observation',
            'asks',
            'exploration',
            'practices',
            'review',
            'reflection'
        ]);

        return Inertia::render('Admin/Steps/Edit', [
            'step' => $step
        ]);
    }

    public function update(Request $request, MeetingStep $step)
    {
        $rules = [
            'step_number' => 'required|numeric',
            'step_type' => 'required|in:observe,ask,exploration,practice,review,reflection',
            'title' => 'required',
        ];

        // Only validate image files if not using axios FormData with exploration
        if ($request->step_type !== 'exploration') {
            $rules['materials'] = 'nullable';
            $rules['materials.*.blocks.*.image_file'] = 'nullable|image|max:2048';
        } else {
            // For exploration with axios FormData, validate files separately
            $rules['materials'] = 'nullable';
        }

        $request->validate($rules);

        $step->update([
            'step_number' => $request->step_number,
            'step_type' => $request->step_type,
            'title' => $request->title,
            'description' => $request->description,
        ]);

        $this->handleStepType($step, $request);

        return redirect()->route('admin.meetings.steps', ['meeting' => $step->meeting_id])->with('success', 'Step berhasil diperbarui');
    }

    public function destroy(MeetingStep $step)
    {
        $meetingId = $step->meeting_id;
        $step->delete();
        return redirect()->route('admin.meetings.steps', ['meeting' => $meetingId])->with('success', 'Step berhasil dihapus');
    }

    /**
     * 🔥 HANDLE TIAP TYPE STEP
     */
    private function handleStepType($step, $request)
    {
        switch ($step->step_type) {

            case 'observe':
                $step->observation()->updateOrCreate(
                    ['meeting_step_id' => $step->id],
                    [
                        'instruction_text' => $request->instruction_text,
                        'resource_type' => $request->resource_type,
                        'resource_url' => $request->resource_url,
                    ]
                );
                break;

            case 'ask':
                // Support single question (backward compat) or array of questions
                $questions = [];

                if ($request->filled('question_prompt')) {
                    // Single question mode (backward compatible)
                    $questions[] = [
                        'question_prompt' => $request->question_prompt,
                        'order' => 1,
                    ];
                } elseif ($request->filled('questions') && is_array($request->input('questions'))) {
                    // Multiple questions mode
                    $questions = collect($request->input('questions'))
                        ->filter(fn($q) => isset($q['question_prompt']) && !empty($q['question_prompt']))
                        ->values()
                        ->map(fn($q, $index) => [
                            'question_prompt' => $q['question_prompt'],
                            'order' => $q['order'] ?? ($index + 1),
                        ])
                        ->all();
                }

                // Delete existing asks for this step
                $step->asks()->delete();

                // Create new asks
                foreach ($questions as $question) {
                    $step->asks()->create($question);
                }
                break;

            case 'exploration':
                // Get existing exploration data for fallback
                $existingExploration = $step->exploration;
                $existingMaterials = $existingExploration ? ($existingExploration->materials ?? []) : [];
                $existingMissions = $existingExploration ? ($existingExploration->missions ?? []) : [];

                // Parse materials from FormData if it's a JSON string
                $materials = $request->input('materials', []);
                if (is_string($materials)) {
                    $decoded = json_decode($materials, true);
                    $materials = $decoded ?? [];
                }

                // Process material images
                $materials = $this->storeExplorationImages(
                    $materials,
                    $this->extractMaterialFiles($request),
                    $existingMaterials
                );

                // Parse case_studies from FormData if it's a JSON string
                $caseStudies = $request->input('case_studies', []);
                if (is_string($caseStudies)) {
                    $decoded = json_decode($caseStudies, true);
                    $caseStudies = $decoded ?? [];
                }

                // Parse missions from FormData if it's a JSON string
                $missions = $request->input('missions', []);
                if (is_string($missions)) {
                    $decoded = json_decode($missions, true);
                    $missions = $decoded ?? [];
                }

                // Process mission images after decoding missions payload
                $missions = $this->storeMissionImages(
                    $missions,
                    $this->extractMissionFiles($request),
                    $existingMissions
                );

                $explorationData = [

                    'code_language' =>
                    $request->code_language,

                    'case_study_title' =>
                    $request->case_study_title,

                    'case_study_description' =>
                    $request->case_study_description,

                    'case_study_alert' =>
                    $request->case_study_alert,


                    'exploration_prompt' =>
                    $request->exploration_prompt,

                    'materials' =>
                    $materials,

                    'case_studies' =>
                    $caseStudies,

                    'missions' =>
                    $missions,
                ];

                $step->exploration()->updateOrCreate(
                    ['meeting_step_id' => $step->id],
                    $explorationData
                );

                break;

            case 'practice':

                $assessmentItems = $this->normalizeAssessmentItems(
                    $request->input('assessment_items')
                );

                // hapus semua soal lama
                $step->practices()->delete();

                // simpan semua soal baru
                foreach ($assessmentItems as $item) {

                    $step->practices()->create([
                        'assessment_mode' => $item['mode'],
                        'assessment_question' => $item['question'],
                        'assessment_options' => $item['options'],
                        'assessment_explanation' => $item['explanation'],
                        'assessment_correct_answer' => (int) ($item['correct_answer'] ?? 0),
                    ]);
                }

                break;

            case 'review':

                $step->review()->updateOrCreate(
                    ['meeting_step_id' => $step->id],
                    [
                        'instruction_text' => $request->instruction_text,
                        'review_items' => $request->review_items ?? [],
                    ]
                );

                break;

            case 'reflection':
                $step->reflection()->updateOrCreate(
                    ['meeting_step_id' => $step->id],
                    [
                        'reflection_question' => $request->reflection_question,
                    ]
                );
                break;
        }
    }

    private function extractMaterialFiles(Request $request): array
    {
        $materialFiles = [];

        // Method 1: Try using allFiles() which includes all uploaded files
        $allFiles = $request->allFiles();

        // Loop through all files and organize by material and block index
        foreach ($allFiles as $fileKey => $file) {
            // File keys will be like: materials.0.blocks.0.image_file or materials_0_blocks_0_image_file
            // Handle both dot notation and underscore notation from different FormData parsers
            $patterns = [
                '/materials\.(\d+)\.blocks\.(\d+)\.image_file/',  // dot notation
                '/materials_(\d+)_blocks_(\d+)_image_file/',       // underscore notation
            ];

            foreach ($patterns as $pattern) {
                if (preg_match($pattern, $fileKey, $matches)) {
                    if (count($matches) === 3) {
                        $materialIdx = (int)$matches[1];
                        $blockIdx = (int)$matches[2];

                        if (!isset($materialFiles[$materialIdx])) {
                            $materialFiles[$materialIdx] = [];
                        }
                        if (!isset($materialFiles[$materialIdx]['blocks'])) {
                            $materialFiles[$materialIdx]['blocks'] = [];
                        }

                        // Store the file
                        $materialFiles[$materialIdx]['blocks'][$blockIdx] = [
                            'image_file' => $file
                        ];
                        break;
                    }
                }
            }
        }

        return $materialFiles;
    }

    private function extractMissionFiles(Request $request): array
    {
        $missionFiles = [];
        $allFiles = $request->allFiles();

        foreach ($allFiles as $fileKey => $file) {
            $patterns = [
                '/missions\.(\d+)\.left_image_file/',
                '/missions_(\d+)_left_image_file/',
                '/missions\.(\d+)\.right_image_file/',
                '/missions_(\d+)_right_image_file/',
            ];

            foreach ($patterns as $pattern) {
                if (! preg_match($pattern, $fileKey, $matches)) {
                    continue;
                }

                if (count($matches) !== 2) {
                    continue;
                }

                $missionIdx = (int) $matches[1];

                if (! isset($missionFiles[$missionIdx])) {
                    $missionFiles[$missionIdx] = [];
                }

                if (str_contains($fileKey, 'left_image_file')) {
                    $missionFiles[$missionIdx]['left_image_file'] = $file;
                }

                if (str_contains($fileKey, 'right_image_file')) {
                    $missionFiles[$missionIdx]['right_image_file'] = $file;
                }

                break;
            }
        }

        return $missionFiles;
    }

    private function normalizeOptions($options): ?array
    {
        if (is_array($options)) {
            return array_values(array_filter($options));
        }

        if (! is_string($options) || trim($options) === '') {
            return null;
        }

        return collect(preg_split('/\r\n|\r|\n/', $options))
            ->map(fn($option) => trim($option))
            ->filter()
            ->values()
            ->all();
    }

    private function normalizeAssessmentItems($items): array
    {
        if (is_string($items)) {
            $decoded = json_decode($items, true);
            $items = $decoded === null ? [] : $decoded;
        }

        if (! is_array($items)) {
            return [];
        }

        return collect($items)
            ->filter(fn($item) => is_array($item) && ! empty(trim($item['question'] ?? '')))
            ->values()
            ->map(function ($item, $index) {
                $mode = ($item['mode'] ?? 'quiz') === 'essay' ? 'essay' : 'quiz';

                return [
                    'id' => $item['id'] ?? ('practices-' . ($index + 1)),
                    'mode' => $mode,
                    'question' => trim($item['question']),
                    'options' => $mode === 'quiz' ? $this->normalizeOptions($item['options'] ?? null) : [],
                    'correct_answer' => (int) ($item['correct_answer'] ?? 0),
                    'explanation' => $item['explanation'] ?? '',
                    'order' => $index + 1,
                ];
            })
            ->all();
    }

    private function normalizeExplorationItems($items): array
    {
        if (is_string($items)) {
            $decoded = json_decode($items, true);
            $items = $decoded === null ? [] : $decoded;
        }

        if (! is_array($items)) {
            return [];
        }

        return array_values(array_map(
            fn($item) => is_array($item) ? $item : [],
            $items,
        ));
    }

    private function storeExplorationImages(array $items, array $files, array $existingItems): array
    {
        $result = [];
        foreach ($items as $itemIndex => $item) {
            $item['blocks'] = $this->storeExplorationBlockImages(
                is_array($item['blocks'] ?? null) ? $item['blocks'] : [],
                is_array(data_get($files, $itemIndex . '.blocks')) ? data_get($files, $itemIndex . '.blocks') : [],
                is_array($existingItems[$itemIndex]['blocks'] ?? null) ? $existingItems[$itemIndex]['blocks'] : [],
            );
            $result[$itemIndex] = $item;
        }
        return $result;
    }

    private function storeExplorationBlockImages(array $blocks, array $files, array $existingBlocks): array
    {
        $result = [];
        foreach ($blocks as $blockIndex => $block) {
            if (($block['type'] ?? null) !== 'image') {
                unset($block['image_file']);
                $result[$blockIndex] = $block;
                continue;
            }

            $uploadedFile = data_get($files, $blockIndex . '.image_file');
            $currentUrl = $existingBlocks[$blockIndex]['url'] ?? ($block['url'] ?? null);

            if ($uploadedFile) {
                $block['url'] = $this->storeUploadedExplorationImage($uploadedFile, $currentUrl);
            } elseif ($currentUrl && empty($block['url'] ?? null)) {
                $this->deleteStoredPublicImage($currentUrl);
                $block['url'] = null;
            }

            unset($block['image_file']);
            $result[$blockIndex] = $block;
        }
        return $result;
    }

    private function storeUploadedExplorationImage($uploadedFile, ?string $currentUrl = null): string
    {
        $this->deleteStoredPublicImage($currentUrl);

        $storedPath = $uploadedFile->store('exploration-images', 'public');

        return '/storage/' . $storedPath;
    }

    private function deleteStoredPublicImage(?string $url): void
    {
        if (! $url || ! str_starts_with($url, '/storage/')) {
            return;
        }

        Storage::disk('public')->delete(ltrim(substr($url, strlen('/storage/')), '/'));
    }

    public function studentResults($meetingId)
    {
        $meeting = Meeting::with('steps')->findOrFail($meetingId);

        $students = User::query()
            ->get()
            ->map(function ($student) use ($meeting) {

                $completedSteps = MeetingStepCompletion::query()
                    ->where('meeting_id', $meeting->id)
                    ->where('user_id', $student->id)
                    ->count();

                $totalSteps = $meeting->steps->count();

                $progress = $totalSteps > 0
                    ? round(($completedSteps / $totalSteps) * 100)
                    : 0;

                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'email' => $student->email,
                    'completed_steps' => $completedSteps,
                    'total_steps' => $totalSteps,
                    'progress' => $progress,
                ];
            });

        return Inertia::render(
            'Admin/Meetings/StudentResults/Index',
            [
                'meeting' => $meeting,
                'students' => $students,
            ]
        );
    }

    public function studentDetail($meetingId, $userId)
    {
        $meeting = Meeting::with(['steps', 'steps.practices'])->findOrFail($meetingId);

        $meetingStepIds = $meeting->steps->pluck('id');
        $practiceSteps = $meeting->steps
            ->where('step_type', 'practice')
            ->sortBy('step_number')
            ->values();

        $student = User::with([
            'askResponses' => function ($query) use ($meetingStepIds) {
                $query->whereIn('meeting_step_id', $meetingStepIds)
                    ->with('step.asks');
            },
            'practiceResponses' => function ($query) use ($meetingStepIds) {
                $query->whereIn('meeting_step_id', $meetingStepIds)
                    ->with('step.practices');
            },
            'reflectionResponses' => function ($query) use ($meetingStepIds) {
                $query->whereIn('meeting_step_id', $meetingStepIds)
                    ->with('step.reflection');
            },
            'observationResponses' => function ($query) use ($meetingStepIds) {
                $query->whereIn('meeting_step_id', $meetingStepIds)
                    ->with('step.observation');
            },
            'explorationResponses' => function ($query) use ($meetingStepIds) {
                $query->whereIn('meeting_step_id', $meetingStepIds)
                    ->with('step.exploration');
            },
            'reviewResponses' => function ($query) use ($meetingStepIds) {
                $query->whereIn('meeting_step_id', $meetingStepIds)
                    ->with('step.review');
            },
        ])->findOrFail($userId);

        $responses = collect()
            ->merge(
                $student->askResponses->groupBy('meeting_step_id')->map(function ($group) {
                    $first = $group->first();
                    $questions = $first->step ? $first->step->asks : collect();

                    $formattedItems = $questions->map(function ($ask) use ($group) {
                        $matchedAnswer = $group->firstWhere('meeting_step_ask_id', $ask->id);

                        return [
                            'question' => $ask->question_prompt,
                            'answer' => isset($matchedAnswer->answer_text) ? $matchedAnswer->answer_text : '-',
                        ];
                    });

                    return [
                        'type' => 'Ask',
                        'step_title' => $first->step ? $first->step->title : null,
                        'step_type' => $first->step ? $first->step->step_type : null,
                        'step_order' => $first->step ? $first->step->step_number : null,
                        'items' => $formattedItems->values()->toArray(),
                    ];
                })
            )
            ->merge(
                $student->practiceResponses->map(function ($item) {
                    $questions = $item->step ? $item->step->practices->values() : collect();
                    $payloadItems = collect($item->practice_payload['items'] ?? [])
                        ->values();

                    $formattedItems = $payloadItems->isNotEmpty()
                        ? $payloadItems->map(function ($payloadItem, $index) use ($questions) {
                            $matchedQuestion = $questions->first(function ($practice, $practiceIndex) use ($payloadItem, $index) {
                                return (string) $practice->id === (string) ($payloadItem['id'] ?? '')
                                    || $practiceIndex === $index;
                            });

                            return [
                                'question' => optional($matchedQuestion)->assessment_question
                                    ?? $payloadItem['question']
                                    ?? '-',
                                'mode' => optional($matchedQuestion)->assessment_mode
                                    ?? $payloadItem['mode']
                                    ?? 'quiz',
                                'options' => optional($matchedQuestion)->assessment_options
                                    ?? $payloadItem['options']
                                    ?? [],
                                'answer' => $payloadItem['answer'] ?? '-',
                            ];
                        })
                        : $questions->map(function ($practice, $index) {
                            return [
                                'question' => $practice->assessment_question,
                                'mode' => $practice->assessment_mode,
                                'options' => $practice->assessment_options,
                                'answer' => '-',
                            ];
                        });

                    return [
                        'response_id' => $item->id, // TAMBAHAN
                        'type' => 'Practice',
                        'step_title' => $item->step ? $item->step->title : null,
                        'step_type' => $item->step ? $item->step->step_type : null,
                        'step_order' => $item->step ? $item->step->step_number : null,
                        'items' => $formattedItems,
                    ];
                })
            )
            ->merge(
                $student->reflectionResponses->map(function ($item) {
                    $question = null;

                    if ($item->step && $item->step->reflection) {
                        $reflection = $item->step->reflection;

                        $question =
                            $reflection->question
                            ?? $reflection->reflection_question
                            ?? null;
                    }

                    return [
                        'type' => 'Reflection',
                        'step_title' => $item->step ? $item->step->title : null,
                        'step_type' => $item->step ? $item->step->step_type : null,
                        'question' => $question,
                        'answer' => $item->reflection_text,
                        'step_order' => $item->step ? $item->step->step_number : null,
                    ];
                })
            )
            ->merge(
                $student->observationResponses->map(function ($item) {
                    $question = null;

                    if ($item->step && $item->step->observation) {
                        $observation = $item->step->observation;

                        $question =
                            $observation->instruction
                            ?? $observation->question
                            ?? null;
                    }

                    return [
                        'type' => 'Observation',
                        'step_title' => $item->step ? $item->step->title : null,
                        'step_type' => $item->step ? $item->step->step_type : null,
                        'question' => $question,
                        'answer' => $item->observation_text,
                        'step_order' => $item->step ? $item->step->step_number : null,
                    ];
                })
            )
            ->merge(
                $student->explorationResponses
                    ->groupBy('meeting_step_id')
                    ->map(function ($group) {
                        $first = $group->first();

                        return [
                            'type' => 'Exploration',
                            'step_title' => $first->step ? $first->step->title : null,
                            'step_type' => $first->step ? $first->step->step_type : null,
                            'coding_answers' =>
                            collect($group)
                                ->map(fn($item) => $item->exploration_payload['coding_answers'] ?? null)
                                ->filter()
                                ->first() ?? [],
                            'items' => $group
                                ->map(fn($item) => $item->exploration_payload)
                                ->values()
                                ->toArray(),
                            'step_order' => $first->step ? $first->step->step_number : null,
                        ];
                    })
            )
            ->merge(
                $student->reviewResponses->map(function ($item) use ($practiceSteps) {
                    $payloadItems = collect($item->review_payload['items'] ?? [])
                        ->values()
                        ->map(function ($reviewItem, $reviewIndex) {
                            $reviewItem['practice_index'] = (int) (
                                $reviewItem['practice_index'] ?? $reviewIndex
                            );

                            return $reviewItem;
                        });
                    $practiceStep = $item->step
                        ? $practiceSteps
                        ->filter(function ($candidate) use ($item) {
                            return $candidate->step_number < $item->step->step_number;
                        })
                        ->sortByDesc('step_number')
                        ->first()
                        : null;
                    $practiceItems = ($practiceStep && $practiceStep->practices)
                        ? $practiceStep->practices->values()
                        : collect();

                    $groups = $practiceItems->isNotEmpty()
                        ? $practiceItems->map(function ($practice, $index) use ($payloadItems) {
                            $items = $payloadItems
                                ->filter(fn($reviewItem) => (int) $reviewItem['practice_index'] === $index)
                                ->values();

                            return [
                                'practice_index' => $index,
                                'practice_title' => $practice->assessment_mode === 'essay'
                                    ? 'Essay'
                                    : 'Latihan Soal ' . ($index + 1),
                                'practice_question' => $practice->assessment_question,
                                'practice_answer' => $items->first()['student_answer'] ?? '-',
                                'items' => $items->map(function ($reviewItem, $reviewIndex) {
                                    return [
                                        'title' => $reviewItem['title'] ?? ('Review ' . ($reviewIndex + 1)),
                                        'question' => $reviewItem['question'] ?? '-',
                                        'review_answer' => $reviewItem['review_answer'] ?? '-',
                                        'evidence' => $reviewItem['evidence'] ?? null,
                                    ];
                                })->values()->toArray(),
                            ];
                        })
                        : $payloadItems
                        ->groupBy(fn($reviewItem) => (int) $reviewItem['practice_index'])
                        ->map(function ($items, $practiceIndex) {
                            $first = $items->first() ?? [];

                            return [
                                'practice_index' => $practiceIndex,
                                'practice_title' => $first['title'] ?? ('Latihan Soal ' . ($practiceIndex + 1)),
                                'practice_question' => $first['question'] ?? '-',
                                'practice_answer' => $first['student_answer'] ?? '-',
                                'items' => $items->map(function ($reviewItem, $reviewIndex) {
                                    return [
                                        'title' => $reviewItem['title'] ?? ('Review ' . ($reviewIndex + 1)),
                                        'question' => $reviewItem['question'] ?? '-',
                                        'review_answer' => $reviewItem['review_answer'] ?? '-',
                                        'evidence' => $reviewItem['evidence'] ?? null,
                                    ];
                                })->values()->toArray(),
                            ];
                        });

                    return [
                        'type' => 'Review',
                        'step_title' => $item->step ? $item->step->title : null,
                        'step_type' => $item->step ? $item->step->step_type : null,
                        'step_order' => $item->step ? $item->step->step_number : null,
                        'items' => $groups->values()->toArray(),
                    ];
                })
            )
            ->sortBy('step_order')
            ->values();

        return Inertia::render(
            'Admin/Meetings/StudentResults/Show',
            [
                'meeting' => $meeting,
                'student' => $student,
                'responses' => $responses,
            ]
        );
    }

    private function storeMissionImages(array $missions, array $files, array $existingMissions = []): array
    {
        return collect($missions)
            ->map(function ($mission, $index) use ($files, $existingMissions) {

                $mission['content_type'] =
                    $mission['content_type'] ?? 'image';

                $mission['content'] =
                    $mission['content'] ?? '';

                $leftFile =
                    data_get($files, $index . '.left_image_file');

                $rightFile =
                    data_get($files, $index . '.right_image_file');

                $existingMission = $existingMissions[$index] ?? [];
                $currentLeftUrl = $existingMission['left_image'] ?? ($mission['left_image'] ?? null);
                $currentRightUrl = $existingMission['right_image'] ?? ($mission['right_image'] ?? null);

                if (($mission['content_type'] ?? 'image') === 'text') {

                    $mission['left_image'] = null;
                    $mission['right_image'] = null;

                    unset($mission['left_image_file']);
                    unset($mission['right_image_file']);

                    return $mission;
                }

                // upload gambar kiri
                if ($leftFile) {

                    $path = $leftFile->store(
                        'mission-images',
                        'public'
                    );

                    $mission['left_image'] =
                        '/storage/' . $path;
                } elseif ($currentLeftUrl && empty($mission['left_image'] ?? null)) {
                    $this->deleteStoredPublicImage($currentLeftUrl);
                    $mission['left_image'] = null;
                }

                // upload gambar kanan
                if ($rightFile) {

                    $path = $rightFile->store(
                        'mission-images',
                        'public'
                    );

                    $mission['right_image'] =
                        '/storage/' . $path;
                } elseif ($currentRightUrl && empty($mission['right_image'] ?? null)) {
                    $this->deleteStoredPublicImage($currentRightUrl);
                    $mission['right_image'] = null;
                }

                // hapus temporary file
                unset($mission['left_image_file']);
                unset($mission['right_image_file']);

                return $mission;
            })
            ->values()
            ->toArray();
    }

    public function unlockPractice($responseId)
    {
        $response = MeetingStepPracticeResponse::findOrFail($responseId);

        $response->update([
            'is_locked' => false,
        ]);

        return back()->with(
            'success',
            'Jawaban berhasil dibuka.'
        );
    }
}
