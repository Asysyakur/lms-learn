import {
    CodeBracketIcon,
    PlayIcon,
    ArrowRightIcon,
    ChevronDownIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";

export default function StepFiveReview({
    stepData,
    explorationSaved,
    explorationOutput,
    reviewCode1,
    setReviewCode1,
    reviewCode1Output,
    setReviewCode1Output,
    reviewCode2,
    setReviewCode2,
    reviewCode2Output,
    setReviewCode2Output,
    codeLanguage = "javascript",
    setCodingLanguage,
    onSave,
    onNext,
    nextLabel = "Lanjut",
}) {
    const languageOptions = [
        { value: "javascript", label: "JavaScript" },
        { value: "python", label: "Python" },
        { value: "php", label: "PHP" },
        { value: "html", label: "HTML" },
        { value: "css", label: "CSS" },
    ];

    const getInputPrompts = (code, language) => {
        if (language === "python") {
            return [...code.matchAll(/input\((["'])(.*?)\1\)/g)].map(
                (match) => match[2],
            );
        }

        if (language === "javascript") {
            return [...code.matchAll(/prompt\((["'])(.*?)\1/g)].map(
                (match) => match[2],
            );
        }

        if (language === "php") {
            const readlinePrompts = [
                ...code.matchAll(/readline\((["'])(.*?)\1\)/g),
            ].map((match) => match[2]);
            const stdinCount = [
                ...code.matchAll(/fgets\(\s*STDIN\s*\)/g),
            ].length;

            return [
                ...readlinePrompts,
                ...Array.from(
                    { length: stdinCount },
                    (_, index) => `Input ${index + 1}`,
                ),
            ];
        }

        return [];
    };

    const formatOutputWithInputs = (output, prompts = [], inputValues = []) => {
        if (prompts.length === 0) {
            return output;
        }

        let cleanedOutput = String(output || "");

        prompts.forEach((promptText) => {
            cleanedOutput = cleanedOutput.replace(promptText, "");
        });

        const inputLines = prompts.map((promptText, index) => {
            const suffix = promptText.endsWith(" ") ? "" : " ";

            return `${promptText}${suffix}${inputValues[index] ?? ""}`;
        });

        const resultText = cleanedOutput.trim();

        return resultText
            ? `${inputLines.join("\n")}\n${resultText}`
            : inputLines.join("\n");
    };

    const compileCode = async (
        code,
        setOutput,
        inputValues = [],
        inputPrompts = [],
    ) => {
        if (codeLanguage === "html") {
            setOutput({ type: "preview", html: code });
            return;
        }

        if (codeLanguage === "css") {
            setOutput({
                type: "preview",
                html: `<style>${code}</style><main class="preview-demo"><h1>Preview CSS</h1><p>Style CSS kamu diterapkan di halaman kecil ini.</p><button>Contoh Button</button></main>`,
            });
            return;
        }

        if (codeLanguage === "python" || codeLanguage === "php") {
            setOutput("Menjalankan program...");

            try {
                const response = await window.axios.post(route("code.run"), {
                    language: codeLanguage,
                    code,
                    inputs: inputValues,
                });

                setOutput(
                    formatOutputWithInputs(
                        response.data.output,
                        inputPrompts,
                        inputValues,
                    ),
                );
            } catch (error) {
                setOutput(
                    formatOutputWithInputs(
                        error.response?.data?.output ||
                            error.response?.data?.message ||
                            error.message,
                        inputPrompts,
                        inputValues,
                    ),
                );
            }
            return;
        }

        if (codeLanguage !== "javascript") {
            setOutput(
                `${languageOptions.find((item) => item.value === codeLanguage)?.label || codeLanguage} belum bisa dijalankan langsung di browser.\nSaat ini compile/run tersedia untuk JavaScript.`,
            );
            return;
        }

        const logs = [];
        const originalLog = console.log;
        const originalWarn = console.warn;
        const originalError = console.error;

        console.log = (...args) => logs.push(args.map(String).join(" "));
        console.warn = (...args) => logs.push(args.map(String).join(" "));
        console.error = (...args) => logs.push(args.map(String).join(" "));

        try {
            let inputCursor = 0;
            const prompt = () => inputValues[inputCursor++] ?? "";
            const result = Function("prompt", '"use strict";\n' + code)(
                prompt,
            );
            if (result !== undefined) {
                logs.push(String(result));
            }
            setOutput(
                formatOutputWithInputs(
                    logs.length > 0
                        ? logs.join("\n")
                        : "Program berhasil dijalankan tanpa output.",
                    inputPrompts,
                    inputValues,
                ),
            );
        } catch (error) {
            setOutput(`${error.name}: ${error.message}`);
        } finally {
            console.log = originalLog;
            console.warn = originalWarn;
            console.error = originalError;
        }
    };

    return (
        <div className="activity-content">
            <div className="activity-info">
                <span className="activity-info-icon">i</span>
                <p>
                    Jalankan masing-masing program dengan menekan tombol Run dan
                    perhatikan hasil output pada bagian bawah.
                </p>
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
                <CodePanel
                    number="1"
                    title="Program Prosedural"
                    value={reviewCode1}
                    setValue={setReviewCode1}
                    output={reviewCode1Output}
                    setOutput={setReviewCode1Output}
                    codeLanguage={codeLanguage}
                    setCodingLanguage={setCodingLanguage}
                    languageOptions={languageOptions}
                    compileCode={compileCode}
                    getInputPrompts={getInputPrompts}
                />
                <CodePanel
                    number="2"
                    title="Program Berorientasi Objek (PBO)"
                    value={reviewCode2}
                    setValue={setReviewCode2}
                    output={reviewCode2Output}
                    setOutput={setReviewCode2Output}
                    codeLanguage={codeLanguage}
                    setCodingLanguage={setCodingLanguage}
                    languageOptions={languageOptions}
                    compileCode={compileCode}
                    getInputPrompts={getInputPrompts}
                />
            </div>

            <div className="activity-note">
                <span className="activity-note-icon">!</span>
                <p>
                    {stepData?.review_prompt ||
                        "Setelah menjalankan kedua program dan melihat output-nya, lanjutkan ke langkah berikutnya untuk menjawab pertanyaan pada halaman selanjutnya."}
                </p>
            </div>

            <div className="flex justify-end">
                <button className="activity-next-button" onClick={onNext}>
                    {nextLabel}
                    <ArrowRightIcon className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

function CodePanel({
    number,
    title,
    value,
    setValue,
    output,
    setOutput,
    codeLanguage,
    setCodingLanguage,
    languageOptions,
    compileCode,
    getInputPrompts,
}) {
    const lineCount = Math.max(value.split("\n").length, 18);
    const [pendingPrompts, setPendingPrompts] = useState([]);
    const [inputValues, setInputValues] = useState([]);
    const [languageOpen, setLanguageOpen] = useState(false);
    const selectedLanguage =
        languageOptions.find((language) => language.value === codeLanguage) ||
        languageOptions[0];

    const runCode = (nextInputValues = []) => {
        const prompts = getInputPrompts(value, codeLanguage);

        if (prompts.length > 0 && nextInputValues.length === 0) {
            setPendingPrompts(prompts);
            setInputValues(prompts.map(() => ""));
            setOutput("");
            return;
        }

        setPendingPrompts([]);
        compileCode(value, setOutput, nextInputValues, prompts);
    };

    return (
        <section className="activity-code-card">
            <div className="activity-card-heading">
                <span className="activity-number">{number}</span>
                <h3>{title}</h3>
            </div>

            <div className="activity-editor">
                <div className="activity-editor-toolbar">
                    <span />
                    <div className="activity-language">
                        <button
                            type="button"
                            className="activity-language-trigger"
                            onClick={() => setLanguageOpen((open) => !open)}
                        >
                            <CodeBracketIcon className="h-5 w-5 text-yellow-400" />
                            <span>{selectedLanguage.label}</span>
                            <ChevronDownIcon
                                className={`h-4 w-4 text-slate-300 transition ${
                                    languageOpen ? "rotate-180" : ""
                                }`}
                            />
                        </button>

                        {languageOpen && (
                            <div className="activity-language-menu">
                                {languageOptions.map((language) => (
                                    <button
                                        key={language.value}
                                        type="button"
                                        className={`activity-language-option ${
                                            language.value === codeLanguage
                                                ? "activity-language-option-active"
                                                : ""
                                        }`}
                                        onClick={() => {
                                            setCodingLanguage(language.value);
                                            setLanguageOpen(false);
                                            setPendingPrompts([]);
                                            setInputValues([]);
                                        }}
                                    >
                                        <span>{language.label}</span>
                                        {language.value === codeLanguage && (
                                            <span className="activity-language-check" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="activity-editor-body">
                    <div className="activity-line-numbers" aria-hidden="true">
                        {Array.from({ length: lineCount }, (_, index) => (
                            <span key={index}>{index + 1}</span>
                        ))}
                    </div>
                    <textarea
                        className="activity-code-input"
                        placeholder="Tulis program di sini..."
                        spellCheck="false"
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                    />
                </div>
            </div>

            <div className="activity-card-actions">
                <button
                    className="activity-run-button"
                    type="button"
                    onClick={() => runCode()}
                >
                    <PlayIcon className="h-4 w-4" />
                    Run
                </button>
                <button
                    className="activity-reset-button"
                    type="button"
                    onClick={() => {
                        setValue("");
                        setOutput("");
                        setPendingPrompts([]);
                        setInputValues([]);
                    }}
                >
                    Reset
                </button>
            </div>

            <div className="activity-output">
                <div className="activity-output-title">
                    <span className="font-mono text-base leading-none">&gt;_</span>
                    Output {title}
                </div>
                {pendingPrompts.length > 0 ? (
                    <div className="activity-input-runner">
                        {pendingPrompts.map((promptText, index) => (
                            <label key={`${promptText}-${index}`}>
                                <span>{promptText}</span>
                                <input
                                    type="text"
                                    value={inputValues[index] || ""}
                                    onChange={(event) => {
                                        const nextValues = [...inputValues];
                                        nextValues[index] = event.target.value;
                                        setInputValues(nextValues);
                                    }}
                                />
                            </label>
                        ))}
                        <button
                            type="button"
                            className="activity-run-button w-fit"
                            onClick={() => runCode(inputValues)}
                        >
                            <PlayIcon className="h-4 w-4" />
                            Jalankan
                        </button>
                    </div>
                ) : isPreviewOutput(output) ? (
                    <iframe
                        className="activity-preview"
                        title={`Preview ${title}`}
                        sandbox="allow-scripts"
                        srcDoc={output.html}
                    />
                ) : (
                    <pre>
                        {output ||
                            "Output akan muncul di sini setelah kamu menekan tombol Run."}
                    </pre>
                )}
            </div>
        </section>
    );
}

function isPreviewOutput(output) {
    return Boolean(output && typeof output === "object" && output.type === "preview");
}
