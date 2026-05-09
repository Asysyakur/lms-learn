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
        $request->validate([
            'meeting_id' => 'required',
            'step_number' => 'required|numeric',
            'step_type' => 'required|in:observe,ask,exploration,practice,review,reflection',
            'title' => 'required',
            'materials' => 'nullable',
            'materials.*.blocks.*.image_file' => 'nullable|image|max:2048',
        ]);

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
        $request->validate([
            'step_number' => 'required|numeric',
            'step_type' => 'required|in:observe,ask,exploration,practice,review,reflection',
            'title' => 'required',
            'materials' => 'nullable',
            'materials.*.blocks.*.image_file' => 'nullable|image|max:2048',
        ]);

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
                $currentExploration = $step->exploration;
                $explorationData = [
                    'exploration_prompt' => $request->exploration_prompt,
                ];

                if (Schema::hasColumn('meeting_step_explorations', 'code_language')) {
                    // store chosen language (if any). presence of code_language indicates compile-capable material
                    $explorationData['code_language'] = $request->code_language ?: null;
                }

                // Accept materials / case studies as array or JSON string
                if (Schema::hasColumn('meeting_step_explorations', 'materials') && $request->filled('materials')) {
                    $materials = $this->normalizeExplorationItems($request->input('materials'));
                    $explorationData['materials'] = $this->storeExplorationImages(
                        $materials ?? [],
                        $request->file('materials') ?? [],
                        $currentExploration ? ($currentExploration->materials ?? []) : [],
                    );
                }

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
                    ]);
                }

                break;

            case 'review':
                $step->review()->updateOrCreate(
                    ['meeting_step_id' => $step->id],
                    [
                        'review_prompt' => $request->review_prompt,
                        'review_code1' => $request->review_code1,
                        'review_code2' => $request->review_code2,
                        'review_code_language' => $request->review_code_language ?? 'javascript',
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
        return collect($items)
            ->values()
            ->map(function (array $item, int $itemIndex) use ($files, $existingItems) {
                $item['blocks'] = $this->storeExplorationBlockImages(
                    is_array($item['blocks'] ?? null) ? $item['blocks'] : [],
                    is_array(data_get($files, $itemIndex . '.blocks')) ? data_get($files, $itemIndex . '.blocks') : [],
                    is_array($existingItems[$itemIndex]['blocks'] ?? null) ? $existingItems[$itemIndex]['blocks'] : [],
                );

                return $item;
            })
            ->all();
    }

    private function storeExplorationBlockImages(array $blocks, array $files, array $existingBlocks): array
    {
        return collect($blocks)
            ->values()
            ->map(function (array $block, int $blockIndex) use ($files, $existingBlocks) {
                if (($block['type'] ?? null) !== 'image') {
                    unset($block['image_file']);

                    return $block;
                }

                $uploadedFile = data_get($files, $blockIndex . '.image_file');
                $currentUrl = $existingBlocks[$blockIndex]['url'] ?? ($block['url'] ?? null);

                if ($uploadedFile) {
                    $block['url'] = $this->storeUploadedExplorationImage($uploadedFile, $currentUrl);
                }

                unset($block['image_file']);

                return $block;
            })
            ->all();
    }

    private function storeUploadedExplorationImage($uploadedFile, ?string $currentUrl = null): string
    {
        if ($currentUrl && str_starts_with($currentUrl, '/storage/')) {
            Storage::disk('public')->delete(ltrim(substr($currentUrl, strlen('/storage/')), '/'));
        }

        $storedPath = $uploadedFile->store('exploration-images', 'public');

        return '/storage/' . $storedPath;
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
        $meeting = Meeting::with('steps')->findOrFail($meetingId);

        $meetingStepIds = $meeting->steps->pluck('id');

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

                    $questions = $first->step
                        ? $first->step->asks
                        : collect();

                    $formattedItems = $questions->map(function ($ask) use ($group) {

                        $matchedAnswer = $group
                            ->firstWhere('meeting_step_ask_id', $ask->id);

                        return [
                            'question' => $ask->question_prompt,
                            'answer' => $matchedAnswer?->answer_text ?? '-',
                        ];
                    });

                    return [
                        'type' => 'Ask',
                        'step_title' => $first->step?->title,
                        'step_type' => $first->step?->step_type,
                        'items' => $formattedItems->values()->toArray(),
                    ];
                })
            )
            ->merge(
                $student->practiceResponses->map(function ($item) {

                    $questions = $item->step
                        ? $item->step->practices
                        : collect();

                    $payloadItems = $item->practice_payload['items'] ?? [];

                    $formattedItems = $questions->map(function ($practice, $index) use ($payloadItems) {

                        $matchedAnswer = collect($payloadItems)
                            ->first(fn($payloadItem, $payloadIndex) => $payloadIndex === $index);

                        return [
                            'question' => $practice->assessment_question,
                            'mode' => $practice->assessment_mode,
                            'options' => $practice->assessment_options,
                            'answer' => $matchedAnswer['answer'] ?? '-',
                        ];
                    });

                    return [
                        'type' => 'Practice',
                        'step_title' => $item->step?->title,
                        'step_type' => $item->step?->step_type,
                        'items' => $formattedItems,
                    ];
                })
            )

            ->merge(
                $student->reflectionResponses->map(function ($item) {

                    $question = null;

                    if ($item->step?->reflection) {
                        $reflection = $item->step->reflection;

                        $question =
                            $reflection->question
                            ?? $reflection->reflection_question
                            ?? null;
                    }

                    return [
                        'type' => 'Reflection',
                        'step_title' => $item->step?->title,
                        'step_type' => $item->step?->step_type,
                        'question' => $question,
                        'answer' => $item->reflection_text,
                    ];
                })
            )

            ->merge(
                $student->observationResponses->map(function ($item) {

                    $question = null;

                    if ($item->step?->observation) {
                        $observation = $item->step->observation;

                        $question =
                            $observation->instruction
                            ?? $observation->question
                            ?? null;
                    }

                    return [
                        'type' => 'Observation',
                        'step_title' => $item->step?->title,
                        'step_type' => $item->step?->step_type,
                        'question' => $question,
                        'answer' => $item->observation_text,
                    ];
                })
            )

            ->merge(
                $student->explorationResponses->map(function ($item) {

                    $question = null;

                    if ($item->step?->exploration) {
                        $exploration = $item->step->exploration;

                        $question =
                            $exploration->case_study
                            ?? $exploration->question
                            ?? null;
                    }

                    return [
                        'type' => 'Exploration',
                        'step_title' => $item->step?->title,
                        'step_type' => $item->step?->step_type,
                        'question' => $question,
                        'answer' => $item->exploration_text,
                    ];
                })
            )

            ->merge(
                $student->reviewResponses->map(function ($item) {

                    $question = null;

                    if ($item->step?->review) {
                        $review = $item->step->review;

                        $question =
                            $review->question
                            ?? $review->review_question
                            ?? null;
                    }

                    return [
                        'type' => 'Review',
                        'step_title' => $item->step?->title,
                        'step_type' => $item->step?->step_type,
                        'question' => $question,
                        'answer' => $item->review_text,
                    ];
                })
            )

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
}
