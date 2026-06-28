import { useState, useRef, useEffect } from "react";
import { BeakerIcon, DocumentIcon } from "@heroicons/react/24/solid";
import { Toast } from "@/Components/FlashToast";
import { codeToHtml } from "shiki";

const getStudyKey = (study, index = 0) => {
    return study.id ?? study.number ?? index;
};

function CaseStudyCard({
    study,
    codingAnswers,
    setCodingAnswers,
    stepData,
    savingMission,
    setSavingMission,
    setToastMessage,
    setToastIsError,
}) {
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);
    const editableCode =
        codingAnswers?.[getStudyKey(study)] ?? study.code ?? "";
    const [selectedLang, setSelectedLang] = useState(
        study.language || "python",
    );
    const lineRef = useRef(null);
    const rawCode = String(
        study.type === "coding" ? editableCode : study.code || "",
    );
    const codeLines = rawCode.replace(/\r/g, "").trimEnd().split("\n");
    const lineHeight = 22; // px per line (approx)

    const runCode = async () => {
        setLoading(true);
        setOutput("");

        try {
            if (selectedLang === "python" || selectedLang === "php") {
                const response = await window.axios.post(route("code.run"), {
                    language: selectedLang,
                    code: study.type === "coding" ? editableCode : study.code,
                    inputs: [],
                });

                setOutput(response.data.output || "Program selesai.");
            } else if (selectedLang === "javascript") {
                // Run in-browser for JS
                const logs = [];
                const originalLog = console.log;
                const originalWarn = console.warn;
                const originalError = console.error;

                console.log = (...args) => logs.push(args.join(" "));
                console.warn = (...args) => logs.push(args.join(" "));
                console.error = (...args) => logs.push(args.join(" "));

                try {
                    const result = Function(
                        '"use strict";\n' +
                            (study.type === "coding"
                                ? editableCode
                                : study.code),
                    )();
                    if (result !== undefined) logs.push(String(result));
                    setOutput(
                        logs.join("\n") || "Program berhasil dijalankan.",
                    );
                } catch (e) {
                    setOutput(e.name + ": " + e.message);
                } finally {
                    console.log = originalLog;
                    console.warn = originalWarn;
                    console.error = originalError;
                }
            } else {
                setOutput("Bahasa ini belum didukung untuk dijalankan.");
            }
        } catch (error) {
            setOutput(
                error.response?.data?.output ||
                    error.response?.data?.message ||
                    error.message ||
                    "Terjadi kesalahan saat menjalankan program.",
            );
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="w-full min-w-0 max-w-full rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex min-w-0 items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                    {study.number || 1}
                </div>

                <h3 className="min-w-0 break-words text-base font-bold text-slate-900 sm:text-lg">
                    {study.title}
                </h3>
            </div>

            <div className="w-full min-w-0 overflow-hidden rounded-2xl bg-[#0B1120]">
                <div className="flex items-center justify-between gap-3 border-b border-slate-700 px-3 py-3 sm:px-4">
                    <div />

                    <div className="flex items-center gap-2">
                        <select
                            value={selectedLang}
                            onChange={(e) => setSelectedLang(e.target.value)}
                            className="rounded-xl bg-[#1E293B] px-3 py-1 text-sm text-slate-200"
                        >
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="php">PHP</option>
                            <option value="html">HTML</option>
                            <option value="css">CSS</option>
                        </select>
                    </div>
                </div>

                <div className="h-[32rem] max-w-full overflow-auto">
                    <div className="flex h-full min-w-full font-mono text-sm">
                        <div
                            ref={lineRef}
                            className="shrink-0 select-none bg-[#071623] px-3 py-4 text-slate-500 sm:px-4"
                        >
                            {codeLines.map((_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        height: lineHeight,
                                        lineHeight: `${lineHeight}px`,
                                    }}
                                    className="text-right pr-1"
                                >
                                    {i + 1}
                                </div>
                            ))}
                        </div>

                        {study.type === "coding" ? (
                            <textarea
                                value={editableCode}
                                onChange={(e) =>
                                    setCodingAnswers((prev) => ({
                                        ...prev,
                                        [getStudyKey(study)]: e.target.value,
                                    }))
                                }
                                onScroll={(e) => {
                                    if (lineRef.current)
                                        lineRef.current.scrollTop =
                                            e.target.scrollTop;
                                }}
                                spellCheck={false}
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="off"
                                style={{
                                    backgroundColor: "#0B1120",
                                    color: "white",
                                    lineHeight: "22px",
                                    tabSize: 4,
                                    height: Math.max(
                                        codeLines.length * lineHeight + 32,
                                        512,
                                    ),
                                }}
                                className="
            w-full
            min-w-[700px]

            resize-none
            border-0

            px-5
            py-4

            font-mono
            text-sm
            leading-[22px]

            text-white
            caret-white

            outline-none
            focus:outline-none
            focus:ring-0

            overflow-hidden
            whitespace-pre

            relative
            z-10
        "
                            />
                        ) : (
                            <pre
                                onScroll={(e) => {
                                    if (lineRef.current)
                                        lineRef.current.scrollTop =
                                            e.target.scrollTop;
                                }}
                                className="m-0 min-h-full min-w-max bg-[#0B1120] px-4 py-4 text-slate-200 sm:px-5"
                            >
                                <code>
                                    {codeLines.map((line, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                height: lineHeight,
                                                lineHeight: `${lineHeight}px`,
                                            }}
                                            className="whitespace-pre"
                                        >
                                            {line || " "}
                                        </div>
                                    ))}
                                </code>
                            </pre>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={runCode}
                        disabled={loading}
                        className="course-step-primary-button"
                    >
                        {loading ? "Running..." : "Run"}
                    </button>

                    <button
                        className="course-step-secondary-button"
                        onClick={() => setOutput("")}
                    >
                        Reset
                    </button>

                    {study.type === "coding" && (
                        <button
                            type="button"
                            onClick={async () => {
                                try {
                                    setSavingMission(true);

                                    const payload = {
                                        type: "coding",
                                        coding_answers: codingAnswers || {},
                                    };

                                    await window.axios.post(
                                        route("pertemuan.step.response", {
                                            id: stepData.meeting_id,
                                            step: stepData.step,
                                        }),
                                        {
                                            response_text:
                                                JSON.stringify(payload),

                                            response_payload: payload,
                                        },
                                    );

                                    setToastMessage(
                                        "Coding berhasil disimpan.",
                                    );

                                    setToastIsError(false);

                                    window.setTimeout(
                                        () => setToastMessage(null),
                                        3000,
                                    );
                                } catch (e) {
                                    setToastMessage("Gagal menyimpan coding.");

                                    setToastIsError(true);

                                    window.setTimeout(
                                        () => setToastMessage(null),
                                        3000,
                                    );
                                } finally {
                                    setSavingMission(false);
                                }
                            }}
                            disabled={savingMission}
                            className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                        >
                            {savingMission
                                ? "Menyimpan..."
                                : "Simpan Coding"}
                        </button>
                    )}
                </div>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 font-semibold text-slate-700">
                    Output Program
                </div>

                <pre className="max-w-full whitespace-pre-wrap break-words text-sm text-slate-700">
                    {output ||
                        "Output akan muncul di sini setelah menekan tombol Run."}
                </pre>
            </div>
        </div>
    );
}

export default function StepThreeExploration({
    stepData,
    onNext,
    savedResponses,
    nextLabel = "Lanjut",
}) {
    const materials =
        stepData?.materials || stepData?.exploration_materials || [];
    const [activeTab, setActiveTab] = useState("missions");
    const [codingAnswers, setCodingAnswers] = useState({});
    const [activeMaterialIndex, setActiveMaterialIndex] = useState(0);
    const [activeMissionIndex, setActiveMissionIndex] = useState(0);
    const [activeCaseStudyIndex, setActiveCaseStudyIndex] = useState(0);
    const [missionAnswers, setMissionAnswers] = useState({});
    const [savingMission, setSavingMission] = useState(false);
    const materialRefs = useRef([]);

    useEffect(() => {
        const saved = savedResponses?.[Number(stepData.step)];

        if (!saved?.exploration_responses) return;

        const answers = {};

        saved.exploration_responses.forEach((missionResponse) => {
            const payload = missionResponse.response_payload || {};

            // LOAD MISSION
            if (payload.items) {
                const missionIndex = Number(missionResponse.mission_index);

                payload.items.forEach((item, qidx) => {
                    answers[`${missionIndex}-${qidx}`] = item.answer || "";
                });
            }

            // LOAD CODING
            if (payload.coding_answers) {
                setCodingAnswers((prev) => ({
                    ...prev,
                    ...payload.coding_answers,
                }));
            }
        });

        setMissionAnswers(answers);
    }, [savedResponses, stepData.step]);

    const scrollToMaterial = (index) => {
        setActiveMaterialIndex(index);
        materialRefs.current[index]?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    const [highlightedCode, setHighlightedCode] = useState({});

    // Toast state (use shared Toast component)
    const [toastMessage, setToastMessage] = useState(null);
    const [toastIsError, setToastIsError] = useState(false);

    // Highlight code blocks ketika material berubah
    useEffect(() => {
        const highlightAllCodes = async () => {
            const allCodes = [];

            materials.forEach((m, midx) => {
                if (!Array.isArray(m.blocks)) return;

                m.blocks.forEach((block, bidx) => {
                    if (block.type !== "code") return;

                    allCodes.push({
                        key: `m-${midx}-${bidx}`,
                        code: block.code,
                        lang: block.language,
                    });
                });
            });

            const generated = {};

            for (const item of allCodes) {
                try {
                    generated[item.key] = await codeToHtml(item.code, {
                        lang: getLanguageAlias(item.lang || "javascript"),
                        theme: "one-dark-pro",
                    });
                } catch (e) {
                    // Ignore highlight failures and keep raw code fallback.
                }
            }

            setHighlightedCode((prev) => {
                const next = { ...prev };
                let changed = false;

                Object.entries(generated).forEach(([key, html]) => {
                    if (!next[key]) {
                        next[key] = html;
                        changed = true;
                    }
                });

                return changed ? next : prev;
            });
        };

        highlightAllCodes();
    }, [materials]);

    const isMissionAnswered = (missionIndex) => {
        const mission = stepData.missions?.[missionIndex];

        if (!mission) return false;

        return mission.questions.every((_, qidx) => {
            return missionAnswers[`${missionIndex}-${qidx}`]?.trim();
        });
    };

    const allMissionsAnswered = () => {
        return (stepData.missions || []).every((mission, missionIndex) =>
            mission.questions.every((_, qidx) =>
                missionAnswers[`${missionIndex}-${qidx}`]?.trim(),
            ),
        );
    };

    const allCodingAnswered = () => {
        const codingStudies =
            stepData.case_studies?.items?.filter(
                (item) => item.type === "coding",
            ) || [];

        return codingStudies.every((study, index) =>
            codingAnswers[getStudyKey(study, index)]?.trim(),
        );
    };

    const finishExploration = () => {
        if (!allMissionsAnswered()) {
            setToastMessage("Semua mission harus diisi terlebih dahulu.");
            setToastIsError(true);
            setTimeout(() => setToastMessage(null), 3000);
            return;
        }

        if (!allCodingAnswered()) {
            setToastMessage("Semua coding harus diisi terlebih dahulu.");
            setToastIsError(true);
            setTimeout(() => setToastMessage(null), 3000);
            return;
        }

        onNext();
    };

    useEffect(() => {
        const updateActiveMaterial = () => {
            const sections = materialRefs.current.filter(Boolean);

            if (sections.length === 0) {
                return;
            }

            const scrollTop = window.scrollY || window.pageYOffset || 0;
            const viewportBottom = scrollTop + window.innerHeight;
            const pageBottom =
                document.documentElement.scrollHeight ||
                document.body.scrollHeight;

            if (viewportBottom >= pageBottom - 8) {
                setActiveMaterialIndex(sections.length - 1);
                return;
            }

            const activationLine = window.innerHeight * 0.28;
            let nextIndex = 0;

            sections.forEach((section, index) => {
                const rect = section.getBoundingClientRect();

                if (rect.top <= activationLine) {
                    nextIndex = index;
                }
            });

            setActiveMaterialIndex(nextIndex);
        };

        let frameId = 0;

        const handleScroll = () => {
            window.cancelAnimationFrame(frameId);
            frameId = window.requestAnimationFrame(updateActiveMaterial);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll);

        return () => {
            window.cancelAnimationFrame(frameId);
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, [materials]);

    const getLanguageAlias = (lang) => {
        const aliases = {
            js: "javascript",
            py: "python",
            html: "html",
            css: "css",
        };
        return aliases[lang?.toLowerCase()] || lang || "javascript";
    };

    const saveMission = async (mission, missionIndex) => {
        try {
            setSavingMission(true);

            const payload = {
                mission_index: missionIndex,
                mission_title: mission.title,

                coding_answers: codingAnswers || {},

                items: mission.questions.map((question, qidx) => ({
                    question,
                    answer: missionAnswers[`${missionIndex}-${qidx}`] || "",
                })),
            };

            await window.axios.post(
                route("pertemuan.step.response", {
                    id: stepData.meeting_id,
                    step: stepData.step,
                }),
                {
                    response_text: JSON.stringify(payload),
                    response_payload: payload,
                },
            );

            setToastMessage("Mission berhasil disimpan.");
            setToastIsError(false);
            window.setTimeout(() => setToastMessage(null), 3280);
        } catch (e) {
            setToastMessage("Gagal menyimpan mission.");
            setToastIsError(true);
            window.setTimeout(() => setToastMessage(null), 3280);
        } finally {
            setSavingMission(false);
        }
    };

    return (
        <div
            className={
                activeTab === "materials" ? "course-detail-grid" : "space-y-6"
            }
        >
            <div className="course-detail-card space-y-4">
                <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
                    {[
                        {
                            key: "missions",
                            label: "Misi",
                        },

                        {
                            key: "case-studies",
                            label: "Codelab",
                        },

                        {
                            key: "materials",
                            label: "Materi",
                        },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => setActiveTab(tab.key)}
                            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                                activeTab === tab.key
                                    ? "bg-blue-600 text-white shadow"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                {/* PDF Viewer Section */}
                {stepData?.exploration_pdf_url && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <div className="mb-3 flex items-center gap-2">
                            <DocumentIcon className="h-5 w-5 text-blue-600" />
                            <h3 className="font-semibold text-slate-900">
                                Materi PDF
                            </h3>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                            <iframe
                                src={stepData.exploration_pdf_url}
                                className="w-full"
                                style={{ height: "600px" }}
                                title="PDF Viewer"
                            />
                        </div>

                        <div className="mt-3">
                            <a
                                href={stepData.exploration_pdf_url}
                                download
                                className="course-step-secondary-button"
                            >
                                Download PDF
                            </a>
                        </div>
                    </div>
                )}

                {activeTab === "materials" && (
                    <>
                        <div className="rounded-lg border border-slate-200 bg-white space-y-6 p-3 sm:p-4 overflow-hidden">
                            {materials.map((m, idx) => (
                                <div
                                    key={idx}
                                    ref={(el) =>
                                        (materialRefs.current[idx] = el)
                                    }
                                    data-material-index={idx}
                                    className="pb-4 border-b border-slate-100 last:border-b-0"
                                >
                                    <h5 className="font-semibold text-slate-900 mb-3 text-lg">
                                        {m.title || `Materi ${idx + 1}`}
                                    </h5>

                                    {Array.isArray(m.blocks) ? (
                                        <div className="space-y-4">
                                            {m.blocks.map((block, bidx) => (
                                                <div key={bidx}>
                                                    {block.type === "text" && (
                                                        <div
                                                            className="prose prose-sm max-w-none sm:prose-base break-words overflow-hidden text-slate-700 [&_ul]:my-2 [&_ol]:my-2 [&_ul]:pl-6 [&_ol]:pl-6 [&_ul]:list-disc [&_ol]:list-decimal [&_li]:my-1"
                                                            style={{
                                                                whiteSpace:
                                                                    "pre-wrap",
                                                                wordBreak:
                                                                    "break-word",
                                                            }}
                                                            dangerouslySetInnerHTML={{
                                                                __html: block.content,
                                                            }}
                                                        />
                                                    )}
                                                    {block.type === "image" && (
                                                        <img
                                                            src={block.url}
                                                            alt={
                                                                block.alt ||
                                                                "Materi gambar"
                                                            }
                                                            className="rounded-lg max-w-full"
                                                        />
                                                    )}
                                                    {block.type === "code" && (
                                                        <div className="relative">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    copyToClipboard(
                                                                        block.code,
                                                                    )
                                                                }
                                                                className="absolute top-2 right-2 bg-slate-600 hover:bg-slate-700 text-white px-3 py-1 text-xs rounded z-10"
                                                            >
                                                                Salin
                                                            </button>
                                                            <div
                                                                className="mt-2 p-3 rounded overflow-auto"
                                                                style={{
                                                                    background:
                                                                        "#282C34",
                                                                }}
                                                            >
                                                                <div
                                                                    dangerouslySetInnerHTML={{
                                                                        __html:
                                                                            highlightedCode[
                                                                                `m-${idx}-${bidx}`
                                                                            ] ||
                                                                            `<pre><code>${block.code}</code></pre>`,
                                                                    }}
                                                                    style={{
                                                                        background:
                                                                            "#282C34",
                                                                        padding:
                                                                            "0.5rem",
                                                                        borderRadius:
                                                                            "0.375rem",
                                                                        fontSize:
                                                                            "14px",
                                                                        lineHeight:
                                                                            "1.5",
                                                                        fontFamily:
                                                                            "monospace",
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div
                                            className="prose prose-sm max-w-none text-slate-700"
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    m.content ||
                                                    "<p>Tidak ada konten materi.</p>",
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
                {activeTab === "case-studies" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900">
                                    {stepData.case_studies?.meta?.title ||
                                        "Aktivitas Eksplorasi"}
                                </h2>
                                <p className="mt-2 text-slate-600">
                                    {stepData.case_studies?.meta?.description}
                                </p>
                            </div>
                        </div>

                        {/* {stepData.case_studies?.meta?.alert && (
                            <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm text-blue-700">
                                {stepData.case_studies?.meta?.alert}
                            </div>
                        )} */}

                        <div className="space-y-8">
                            {stepData.case_studies?.items
                                ?.slice(
                                    activeCaseStudyIndex,
                                    activeCaseStudyIndex + 1,
                                )
                                .map((study, idx) => (
                                    <div
                                        key={activeCaseStudyIndex}
                                        className={
                                            study.type === "coding"
                                                ? "grid gap-6"
                                                : "grid gap-6 xl:grid-cols-2"
                                        }
                                    >
                                        {study.type === "coding" ? (
                                            <CaseStudyCard
                                                study={{
                                                    ...study,
                                                    title:
                                                        study.title ||
                                                        "Coding Mandiri",
                                                    code:
                                                        study.left_code ||
                                                        study.code ||
                                                        "",
                                                }}
                                                codingAnswers={codingAnswers}
                                                setCodingAnswers={
                                                    setCodingAnswers
                                                }
                                                stepData={stepData}
                                                savingMission={savingMission}
                                                setSavingMission={
                                                    setSavingMission
                                                }
                                                setToastMessage={
                                                    setToastMessage
                                                }
                                                setToastIsError={
                                                    setToastIsError
                                                }
                                            />
                                        ) : (
                                            <>
                                                <CaseStudyCard
                                                    study={{
                                                        ...study,
                                                        title:
                                                            study.left_title ||
                                                            "Program Prosedural",
                                                        code: study.left_code,
                                                        number: 1,
                                                    }}
                                                    stepData={stepData}
                                                    savingMission={
                                                        savingMission
                                                    }
                                                    setSavingMission={
                                                        setSavingMission
                                                    }
                                                    setToastMessage={
                                                        setToastMessage
                                                    }
                                                    setToastIsError={
                                                        setToastIsError
                                                    }
                                                />

                                                <CaseStudyCard
                                                    study={{
                                                        ...study,
                                                        title:
                                                            study.right_title ||
                                                            "Program PBO",
                                                        code: study.right_code,
                                                        number: 2,
                                                    }}
                                                    stepData={stepData}
                                                    savingMission={
                                                        savingMission
                                                    }
                                                    setSavingMission={
                                                        setSavingMission
                                                    }
                                                    setToastMessage={
                                                        setToastMessage
                                                    }
                                                    setToastIsError={
                                                        setToastIsError
                                                    }
                                                />
                                            </>
                                        )}
                                    </div>
                                ))}

                            {/* NAVIGATION */}
                            <div className="flex flex-col items-stretch gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
                                <button
                                    type="button"
                                    disabled={activeCaseStudyIndex === 0}
                                    onClick={() =>
                                        setActiveCaseStudyIndex((prev) =>
                                            Math.max(prev - 1, 0),
                                        )
                                    }
                                    className="course-step-secondary-button w-full disabled:opacity-40 sm:w-auto"
                                >
                                    Sebelumnya
                                </button>

                                <div className="text-center text-sm font-medium text-slate-500">
                                    Studi Kasus {activeCaseStudyIndex + 1} dari{" "}
                                    {stepData.case_studies?.items?.length || 0}
                                </div>

                                {activeCaseStudyIndex <
                                (stepData.case_studies?.items?.length || 0) -
                                    1 ? (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setActiveCaseStudyIndex(
                                                (prev) => prev + 1,
                                            )
                                        }
                                        className="course-step-primary-button w-full sm:w-auto"
                                    >
                                        Berikutnya
                                    </button>
                                ) : (
                                    <button
                                        className="course-step-primary-button w-full sm:w-auto"
                                        onClick={finishExploration}
                                    >
                                        {nextLabel}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === "missions" && (
                    <>
                        {/* MISSIONS */}
                        {Array.isArray(stepData?.missions) &&
                            stepData.missions.length > 0 && (
                                <div className="space-y-6">
                                    {stepData.missions
                                        .slice(
                                            activeMissionIndex,
                                            activeMissionIndex + 1,
                                        )
                                        .map((mission, midx) => (
                                            <div
                                                key={midx}
                                                className="w-full min-w-0 max-w-full space-y-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
                                            >
                                                <div className="min-w-0">
                                                    <h4 className="break-words text-xl font-bold text-slate-900 sm:text-2xl">
                                                        {mission.title}
                                                    </h4>

                                                    <p className="mt-2 break-words text-sm text-slate-600 sm:text-base">
                                                        {mission.description}
                                                    </p>
                                                </div>

                                                <div className="grid min-w-0 gap-6 2xl:grid-cols-[1.1fr_0.9fr]">
                                                    {(mission.content_type ||
                                                        "image") === "image" ? (
                                                        <div className="min-w-0 space-y-6">
                                                            {/* GAMBAR A */}
                                                            <div className="min-w-0 rounded-3xl border border-slate-200 bg-slate-50 p-3 shadow-sm sm:p-4">
                                                                <div className="mb-3 flex items-center gap-2">
                                                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                                                                        A
                                                                    </div>

                                                                    <div className="text-sm font-semibold text-slate-700">
                                                                        Gambar A
                                                                    </div>
                                                                </div>

                                                                <div className="mb-3 max-h-96 overflow-auto rounded-lg border border-slate-200 bg-white">
                                                                    <img
                                                                        src={
                                                                            mission.left_image
                                                                        }
                                                                        alt="Gambar A"
                                                                        className="h-auto max-h-[420px] w-full rounded-2xl object-contain"
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* GAMBAR B */}
                                                            <div className="min-w-0 rounded-3xl border border-slate-200 bg-slate-50 p-3 shadow-sm sm:p-4">
                                                                <div className="mb-3 flex items-center gap-2">
                                                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                                                                        B
                                                                    </div>

                                                                    <div className="text-sm font-semibold text-slate-700">
                                                                        Gambar B
                                                                    </div>
                                                                </div>

                                                                <div className="mb-3 max-h-96 overflow-auto rounded-lg border border-slate-200 bg-white">
                                                                    <img
                                                                        src={
                                                                            mission.right_image
                                                                        }
                                                                        alt="Gambar B"
                                                                        className="h-auto max-h-[420px] w-full rounded-2xl object-contain"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="2xl:max-h-[52rem] overflow-hidden">
                                                            <div
                                                                className="
    h-full
    max-h-[48rem]
    overflow-y-auto
    overflow-x-auto
    rounded-3xl
    border
    border-slate-200
    bg-white
    p-6
    prose
    prose-slate
    max-w-none
    [&_img]:max-w-full
    [&_table]:block
    [&_table]:overflow-x-auto
    [&_pre]:overflow-x-auto
    [&_code]:break-words
    "
                                                                dangerouslySetInnerHTML={{
                                                                    __html:
                                                                        mission.content ||
                                                                        "",
                                                                }}
                                                            />
                                                        </div>
                                                    )}

                                                    {/* KANAN - PERTANYAAN */}
                                                    <div className="min-w-0 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                                                        <div className="mb-6">
                                                            <h5 className="text-xl font-bold text-slate-900 sm:text-2xl">
                                                                Jawab Pertanyaan
                                                            </h5>

                                                            <p className="mt-2 text-sm text-slate-600">
                                                                Jawablah
                                                                pertanyaan
                                                                dibawah ini!
                                                            </p>
                                                        </div>

                                                        <div className="2xl:max-h-[52rem] 2xl:overflow-hidden">
                                                            <div className="space-y-5 2xl:max-h-[40rem] 2xl:overflow-y-auto">
                                                                {mission.questions?.map(
                                                                    (
                                                                        q,
                                                                        qidx,
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                qidx
                                                                            }
                                                                            className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4"
                                                                        >
                                                                            <label className="mb-3 flex min-w-0 items-start gap-3">
                                                                                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                                                                                    {qidx +
                                                                                        1}
                                                                                </div>

                                                                                <span className="min-w-0 break-words text-sm font-semibold text-slate-700">
                                                                                    {
                                                                                        q
                                                                                    }
                                                                                </span>
                                                                            </label>

                                                                            <textarea
                                                                                value={
                                                                                    missionAnswers[
                                                                                        `${activeMissionIndex}-${qidx}`
                                                                                    ] ||
                                                                                    ""
                                                                                }
                                                                                onChange={(
                                                                                    e,
                                                                                ) =>
                                                                                    setMissionAnswers(
                                                                                        (
                                                                                            prev,
                                                                                        ) => ({
                                                                                            ...prev,
                                                                                            [`${activeMissionIndex}-${qidx}`]:
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                        }),
                                                                                    )
                                                                                }
                                                                                className="min-h-[140px] w-full rounded-2xl border border-slate-300 bg-white p-3 text-sm text-slate-700 focus:border-blue-500 focus:ring-blue-500"
                                                                                placeholder="Tulis jawabanmu di sini..."
                                                                            />
                                                                        </div>
                                                                    ),
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                saveMission(
                                                    stepData.missions[
                                                        activeMissionIndex
                                                    ],
                                                    activeMissionIndex,
                                                )
                                            }
                                            disabled={savingMission}
                                            className="course-step-primary-button w-full disabled:opacity-50 sm:w-auto"
                                        >
                                            {savingMission
                                                ? "Menyimpan..."
                                                : "Simpan Mission"}
                                        </button>
                                    </div>
                                    <div className="flex flex-col items-stretch gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
                                        {/* PREV */}
                                        <button
                                            type="button"
                                            disabled={activeMissionIndex === 0}
                                            onClick={() =>
                                                setActiveMissionIndex((prev) =>
                                                    Math.max(prev - 1, 0),
                                                )
                                            }
                                            className="course-step-secondary-button w-full disabled:opacity-40 sm:w-auto"
                                        >
                                            Sebelumnya
                                        </button>

                                        <div className="text-center text-sm font-medium text-slate-500">
                                            Mission {activeMissionIndex + 1}{" "}
                                            dari {stepData.missions.length}
                                        </div>

                                        {/* NEXT */}
                                        {activeMissionIndex <
                                        stepData.missions.length - 1 ? (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setActiveMissionIndex(
                                                        (prev) => prev + 1,
                                                    );
                                                }}
                                                className="course-step-primary-button w-full sm:w-auto"
                                            >
                                                Mission Berikutnya
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    if (allCodingAnswered()) {
                                                        finishExploration();
                                                    } else {
                                                        setActiveTab(
                                                            "case-studies",
                                                        );
                                                    }
                                                }}
                                                className="course-step-primary-button w-full sm:w-auto"
                                            >
                                                {allCodingAnswered()
                                                    ? nextLabel
                                                    : "Lanjut ke Codelab"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                    </>
                )}
            </div>
            {activeTab === "materials" && (
                <div className="course-detail-card space-y-3 sticky top-4 max-h-fit">
                    <h3 className="font-bold">Daftar Materi</h3>
                    {materials.length > 0 ? (
                        <ul className="space-y-1 text-sm">
                            {materials.map((m, idx) => (
                                <li key={idx}>
                                    <button
                                        type="button"
                                        onClick={() => scrollToMaterial(idx)}
                                        className={`w-full rounded-lg px-3 py-2 text-left font-medium transition ${
                                            activeMaterialIndex === idx
                                                ? "bg-blue-50 text-blue-600 ring-1 ring-blue-200"
                                                : "text-slate-700 hover:bg-slate-100"
                                        }`}
                                    >
                                        {m.title || `Materi ${idx + 1}`}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="course-detail-text">
                            Tidak ada materi tersedia.
                        </p>
                    )}
                    <div className="flex justify-end pt-6">
                        <button
                            onClick={finishExploration}
                            className="course-step-primary-button"
                        >
                            {nextLabel ? nextLabel : "Selesai"}
                        </button>
                    </div>
                </div>
            )}
            {/* Shared toast for client-side messages */}
            <Toast message={toastMessage} isError={toastIsError} />
        </div>
    );
}

// Toast markup (rendered at root so styles are consistent with admin)
function ExplorationToast({ phase, message, isError }) {
    if (!message || phase === "idle") return null;

    const phaseClass = phase === "exit" ? "toast-exit" : "toast-enter";

    return (
        <div className="fixed right-4 top-4 z-50 w-[calc(100vw-2rem)] max-w-sm">
            <div
                className={`${phaseClass} overflow-hidden rounded-2xl border px-4 py-3 shadow-lg backdrop-blur ${isError ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}
            >
                <div
                    className={`toast-progress ${isError ? "toast-progress-error" : "toast-progress-success"}`}
                />
                <p className="text-sm font-semibold">{message}</p>
            </div>
        </div>
    );
}

// Attach the toast UI to `window.__exploration_toast_container` so it's possible
// to render it from the component root without lifting state across files.
// The actual rendering is handled inside the component via state; keep this
// export for potential future reuse.
ExplorationToast.displayName = "ExplorationToast";
