<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MeetingStep;
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
            'ask',
            'exploration',
            'practice',
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
            'ask',
            'exploration',
            'practice',
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
                $step->ask()->updateOrCreate(
                    ['meeting_step_id' => $step->id],
                    [
                        'question_prompt' => $request->question_prompt,
                    ]
                );
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
                $step->practice()->updateOrCreate(
                    ['meeting_step_id' => $step->id],
                    [
                        'assessment_mode' => $request->assessment_mode,
                        'assessment_question' => $request->assessment_question,
                        'assessment_options' => $this->normalizeOptions($request->assessment_options),
                    ]
                );
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
            ->map(fn ($option) => trim($option))
            ->filter()
            ->values()
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
            fn ($item) => is_array($item) ? $item : [],
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
}
