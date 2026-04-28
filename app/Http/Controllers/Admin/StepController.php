<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MeetingStep;
use Illuminate\Http\Request;
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
        ]);

        $step = MeetingStep::create($request->only([
            'meeting_id',
            'step_number',
                'step_type',
                'title',
                'description',
            ]));

        $this->handleStepType($step, $request);

        return back();
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
        ]);

        $step->update([
            'step_number' => $request->step_number,
            'step_type' => $request->step_type,
            'title' => $request->title,
            'description' => $request->description,
        ]);

        $this->handleStepType($step, $request);

        return back();
    }

    public function destroy(MeetingStep $step)
    {
        $step->delete();
        return back();
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
                $explorationData = [
                    'exploration_mode' => $request->exploration_mode,
                    'exploration_prompt' => $request->exploration_prompt,
                ];

                if (Schema::hasColumn('meeting_step_explorations', 'code_language')) {
                    $explorationData['code_language'] = $request->exploration_mode === 'code_compile'
                        ? ($request->code_language ?: 'javascript')
                        : null;
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
}
