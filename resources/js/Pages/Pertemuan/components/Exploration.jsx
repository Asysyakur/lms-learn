import { useState, useRef, useEffect } from "react";
import {
    BeakerIcon,
    PencilSquareIcon,
    DocumentIcon,
} from "@heroicons/react/24/solid";
import { codeToHtml } from "shiki";

export default function StepThreeExploration({
    stepData,
    explorationCode,
    codeLanguage,
    setCompileOutput,
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

    const materials =
        stepData?.materials || stepData?.exploration_materials || [];
    const [activeTab, setActiveTab] = useState("materials");
    const [activeMaterialIndex, setActiveMaterialIndex] = useState(0);
    const materialRefs = useRef([]);

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

    // Highlight code blocks ketika material berubah
    useEffect(() => {
        const highlightAllCodes = async () => {
            const allCodes = [];
            materials.forEach((m, midx) => {
                if (Array.isArray(m.blocks)) {
                    m.blocks.forEach((block, bidx) => {
                        if (block.type === "code") {
                            allCodes.push({
                                key: `m-${midx}-${bidx}`,
                                code: block.code,
                                lang: block.language,
                            });
                        }
                    });
                }
            });
            const newHighlighted = { ...highlightedCode };
            for (const item of allCodes) {
                if (!newHighlighted[item.key]) {
                    try {
                        const html = await codeToHtml(item.code, {
                            lang: getLanguageAlias(item.lang || "javascript"),
                            theme: "one-dark-pro",
                        });
                        newHighlighted[item.key] = html;
                    } catch (e) {
                        console.error("Shiki error:", e);
                    }
                }
            }
            setHighlightedCode(newHighlighted);
        };

        highlightAllCodes();
    }, [materials]);

    useEffect(() => {
        const updateActiveMaterial = () => {
            const sections = materialRefs.current.filter(Boolean);

            if (sections.length === 0) {
                return;
            }

            const scrollTop = window.scrollY || window.pageYOffset || 0;
            const viewportBottom = scrollTop + window.innerHeight;
            const pageBottom =
                document.documentElement.scrollHeight || document.body.scrollHeight;

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

    return (
        <div className="course-detail-grid">
            <div className="course-detail-card space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <BeakerIcon className="h-5 w-5 text-[rgb(var(--color-primary))]" />
                    Eksplorasi per pertemuan
                </div>

                <div className="course-exploration-box">
                    <p className="font-semibold text-slate-900">
                        Pelajari dan eksplorasi lebih dalam dengan materi, studi
                        kasus, atau tugas praktis yang disediakan di bagian ini.
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                        {stepData?.exploration_prompt ||
                            "Bagian ini nanti bisa berisi tugas berbeda sesuai materi dan kebutuhan pertemuan yang sedang dibuka."}
                    </p>
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
                                className="course-secondary-button inline-block text-center"
                            >
                                Download PDF
                            </a>
                        </div>
                    </div>
                )}

                {/* Materials Section */}
                <div className="rounded-lg border border-slate-200 bg-white overflow-auto space-y-6 p-4">
                    {materials.map((m, idx) => (
                        <div
                            key={idx}
                            ref={(el) => (materialRefs.current[idx] = el)}
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
                                                    className="prose prose-sm max-w-none text-slate-700 [&_ul]:my-2 [&_ol]:my-2 [&_ul]:pl-6 [&_ol]:pl-6 [&_ul]:list-disc [&_ol]:list-decimal [&_li]:my-1"
                                                    style={{
                                                        whiteSpace: "pre-wrap",
                                                        wordBreak: "break-word",
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

                <div className="flex flex-wrap gap-3">
                    <button
                        className="course-secondary-button"
                        onClick={onNext}
                    >
                        {nextLabel}
                    </button>
                </div>
            </div>

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
            </div>
        </div>
    );
}
