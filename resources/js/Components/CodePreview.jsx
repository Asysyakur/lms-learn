import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

const LANGUAGE_ALIASES = {
    js: "javascript",
    py: "python",
    html: "html",
    css: "css",
};

export default function CodePreview({ code, language, className = "" }) {
    const [html, setHtml] = useState("");

    useEffect(() => {
        const lang =
            LANGUAGE_ALIASES[language?.toLowerCase()] ||
            language ||
            "javascript";

        const highlight = async () => {
            try {
                const result = await codeToHtml(code || "", {
                    lang,
                    theme: "one-dark-pro",
                });

                setHtml(result);
            } catch {
                setHtml(`<pre><code>${code || ""}</code></pre>`);
            }
        };

        highlight();
    }, [code, language]);

    return (
        <div
            dangerouslySetInnerHTML={{ __html: html }}
            className={`
        shiki-preview

        [&_.shiki]:!bg-[#282C34]
        [&_.shiki]:rounded-lg
        [&_.shiki]:overflow-auto

        [&_.shiki_code]:bg-transparent
        [&_.shiki_code]:p-0

        [&_.shiki_span]:bg-transparent

        ${className}
    `}
        />
    );
}
