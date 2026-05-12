import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function FlashToast() {
  const { flash, errors } = usePage().props;
  const [phase, setPhase] = useState("idle");
  const validationMessage = errors ? Object.values(errors).find(Boolean) : null;
  const hasToastMessage = Boolean(flash?.success || flash?.error || validationMessage);
  const visible = phase !== "idle";
  const displayMessage = flash?.success || flash?.error || validationMessage;

  useEffect(() => {
    if (hasToastMessage) {
      setPhase("enter");

      const showTimer = window.setTimeout(() => setPhase("show"), 180);
      const exitTimer = window.setTimeout(() => setPhase("exit"), 3000);
      const hideTimer = window.setTimeout(() => setPhase("idle"), 3280);

      return () => {
        window.clearTimeout(showTimer);
        window.clearTimeout(exitTimer);
        window.clearTimeout(hideTimer);
      };
    }

    setPhase("idle");
    return undefined;
  }, [hasToastMessage, flash?.success, flash?.error, validationMessage]);

  if (!visible || !hasToastMessage) {
    return null;
  }

  const isError = Boolean(flash.error || validationMessage);
  const phaseClass = phase === "exit" ? "toast-exit" : "toast-enter";

  return (
    <div className="fixed right-4 top-4 z-50 w-[calc(100vw-2rem)] max-w-sm">
      <div
        className={`${phaseClass} overflow-hidden rounded-2xl border px-4 py-3 shadow-lg backdrop-blur ${isError ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}
      >
        <div className={`toast-progress ${isError ? "toast-progress-error" : "toast-progress-success"}`} />
        <p className="text-sm font-semibold">{displayMessage}</p>
      </div>
    </div>
  );
}

// Reusable programmatic toast. Shows/hides automatically when `message` changes.
export function Toast({ message, isError = false }) {
  const [phase, setPhase] = useState("idle");

  useEffect(() => {
    if (message) {
      setPhase("enter");

      const showTimer = window.setTimeout(() => setPhase("show"), 180);
      const exitTimer = window.setTimeout(() => setPhase("exit"), 3000);
      const hideTimer = window.setTimeout(() => setPhase("idle"), 3280);

      return () => {
        window.clearTimeout(showTimer);
        window.clearTimeout(exitTimer);
        window.clearTimeout(hideTimer);
      };
    }

    setPhase("idle");
    return undefined;
  }, [message]);

  if (!message || phase === "idle") return null;

  const phaseClass = phase === "exit" ? "toast-exit" : "toast-enter";

  return (
    <div className="fixed right-4 top-4 z-50 w-[calc(100vw-2rem)] max-w-sm">
      <div
        className={`${phaseClass} overflow-hidden rounded-2xl border px-4 py-3 shadow-lg backdrop-blur ${isError ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}
      >
        <div className={`toast-progress ${isError ? "toast-progress-error" : "toast-progress-success"}`} />
        <p className="text-sm font-semibold">{message}</p>
      </div>
    </div>
  );
}