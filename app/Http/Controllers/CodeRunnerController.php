<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Validation\Rule;
use Symfony\Component\Process\Process;
use Throwable;

class CodeRunnerController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'language' => ['required', Rule::in(['python', 'php'])],
            'code' => ['required', 'string', 'max:20000'],
            'inputs' => ['array'],
            'inputs.*' => ['nullable', 'string', 'max:1000'],
        ]);

        $language = $validated['language'];
        $code = $validated['code'];
        $input = collect($validated['inputs'] ?? [])
            ->map(fn ($value) => (string) $value)
            ->implode(PHP_EOL);

        if ($input !== '') {
            $input .= PHP_EOL;
        }

        return $language === 'python'
            ? $this->runPython($code, $input)
            : $this->runPhp($code, $input);
    }

    private function runPython(string $code, string $input): JsonResponse
    {
        $command = $this->pythonCommand();

        if (! $command) {
            return response()->json([
                'ok' => false,
                'output' => 'Python tidak ditemukan di server. Install Python atau tambahkan ke PATH.',
            ], 422);
        }

        return $this->runTempFile($command, $code, 'py', $input);
    }

    private function runPhp(string $code, string $input): JsonResponse
    {
        $source = str_starts_with(ltrim($code), '<?php')
            ? $code
            : "<?php\n".$code;

        return $this->runTempFile([PHP_BINARY], $source, 'php', $input);
    }

    private function runTempFile(array $command, string $source, string $extension, string $input): JsonResponse
    {
        $directory = storage_path('framework/code-runner');

        File::ensureDirectoryExists($directory);

        $path = tempnam($directory, 'run_');
        $filePath = $path.'.'.$extension;

        rename($path, $filePath);
        file_put_contents($filePath, $source);

        try {
            $process = new Process([...$command, $filePath], $directory, null, $input, 5);
            $process->run();

            $output = trim($process->getOutput().$process->getErrorOutput());

            return response()->json([
                'ok' => $process->isSuccessful(),
                'output' => $output !== '' ? $output : 'Program selesai tanpa output.',
            ], $process->isSuccessful() ? 200 : 422);
        } catch (Throwable $error) {
            return response()->json([
                'ok' => false,
                'output' => 'Program dihentikan: '.$error->getMessage(),
            ], 422);
        } finally {
            if (is_file($filePath)) {
                unlink($filePath);
            }
        }
    }

    private function pythonCommand(): ?array
    {
        $candidates = PHP_OS_FAMILY === 'Windows'
            ? [['python'], ['py', '-3'], ['python3']]
            : [['python3'], ['python']];

        foreach ($candidates as $candidate) {
            $process = new Process([...$candidate, '--version'], null, null, null, 2);
            $process->run();

            if ($process->isSuccessful()) {
                return $candidate;
            }
        }

        return null;
    }
}
