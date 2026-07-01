import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import {
    ArrowLeftIcon,
    ArrowPathIcon,
    BookOpenIcon,
    CheckCircleIcon,
    ChatBubbleLeftRightIcon,
    ClipboardDocumentCheckIcon,
    ClipboardDocumentListIcon,
    HomeIcon,
    InformationCircleIcon,
    PlayCircleIcon,
    QuestionMarkCircleIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    UserCircleIcon,
    XMarkIcon,
} from "@heroicons/react/24/solid";

export default function Sidebar({
    showMobileNav = true,
    variant = "default",
    courseTitle = "",
    courseId = null,
    steps = [],
    activeStep = 1,
    progressPercent = 0,
    completedSteps = 0,
    showProgressCard = false,
    progressLabel = "Progres Belajar",
    progressDetail = "",
    progressActionLabel = "Lihat Detail",
    progressActionHref = null,
}) {
    const { url, props } = usePage();
    const user = props.auth?.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const menu = [
        { name: "Beranda", href: "/beranda", icon: HomeIcon },
        { name: "Tes", href: "/tes", icon: ClipboardDocumentListIcon },
        { name: "Tentang", href: "/about", icon: InformationCircleIcon },
    ];

    const isCourseSidebar = variant === "progress";
    const stepIcons = [
        BookOpenIcon,
        ChatBubbleLeftRightIcon,
        PlayCircleIcon,
        ClipboardDocumentCheckIcon,
        ArrowPathIcon,
        QuestionMarkCircleIcon,
    ];

    const normalizedProgress = Math.max(0, Math.min(100, progressPercent || 0));

    const renderProgressCard = () => {
        if (!showProgressCard) {
            return null;
        }

        const detailText =
            progressDetail ||
            `${completedSteps} dari ${steps.length || 0} materi selesai`;

        return (
            <div className="rounded-2xl bg-white/10 p-4 text-white ring-1 ring-white/10">
                <div className="flex items-center gap-4">
                    <div
                        className="relative h-16 w-16 shrink-0 rounded-full p-1"
                        style={{
                            background: `conic-gradient(rgb(250 204 21) 0 ${normalizedProgress}%, rgba(255,255,255,0.15) ${normalizedProgress}% 100%)`,
                        }}
                    >
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-[rgb(var(--color-primary))] text-sm font-black">
                            {normalizedProgress}%
                        </div>
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                            {progressLabel}
                        </div>
                        <div className="mt-1 text-sm font-bold leading-5 text-white">
                            {detailText}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const mobileTitle = isCourseSidebar
        ? courseTitle || "Pertemuan"
        : "OOPCODE";

    return (
        <>
            {showMobileNav && (
                <nav className="mobile-navbar md:hidden">
                    <div className="mobile-navbar-row">
                        <div className="mobile-navbar-brand">
                            {isCourseSidebar ? (
                                <BookOpenIcon className="h-5 w-5 shrink-0" />
                            ) : (
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-xs text-[rgb(var(--color-primary))]">
                                    O
                                </span>
                            )}
                            <span className="min-w-0 truncate">
                                {mobileTitle}
                            </span>
                        </div>

                        <button
                            type="button"
                            className="mobile-menu-button"
                            onClick={() => setMobileMenuOpen((open) => !open)}
                            aria-label={
                                mobileMenuOpen ? "Tutup menu" : "Buka menu"
                            }
                            aria-expanded={mobileMenuOpen}
                        >
                            {mobileMenuOpen ? (
                                <XMarkIcon className="h-5 w-5" />
                            ) : (
                                <Bars3Icon className="h-5 w-5" />
                            )}
                        </button>
                    </div>

                    {mobileMenuOpen && (
                        <div className="mobile-nav-panel">
                            {isCourseSidebar ? (
                                <>
                                    <Link
                                        href={route("pertemuan", {
                                            id: courseId,
                                        })}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="mobile-nav-link"
                                    >
                                        <span>Kembali ke overview</span>
                                    </Link>

                                    {steps.map((item) => {
                                        const isActive =
                                            item.step === activeStep;
                                        const isDone =
                                            completedSteps >= item.step;
                                        const isUnlocked =
                                            item.step === 1 ||
                                            completedSteps >= item.step - 1;
                                        const StepIcon =
                                            item.icon ||
                                            stepIcons[item.step - 1] ||
                                            BookOpenIcon;

                                        return (
                                            <Link
                                                key={item.step}
                                                href={route("pertemuan.step", {
                                                    id: courseId,
                                                    step: item.step,
                                                })}
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                                className={`mobile-nav-link ${
                                                    isActive
                                                        ? "mobile-nav-link-active"
                                                        : ""
                                                } ${
                                                    !isUnlocked
                                                        ? "opacity-50 pointer-events-none"
                                                        : ""
                                                }`}
                                            >
                                                {isDone ? (
                                                    <CheckCircleIcon className="mobile-nav-icon" />
                                                ) : isActive ? (
                                                    <PlayCircleIcon className="mobile-nav-icon" />
                                                ) : (
                                                    <StepIcon className="mobile-nav-icon" />
                                                )}
                                                <span className="min-w-0 flex-1">
                                                    <span className="block truncate">
                                                        {item.step}.{" "}
                                                        {item.title}
                                                    </span>
                                                    <span className="block text-xs font-medium opacity-80">
                                                        {isDone
                                                            ? "Selesai"
                                                            : isActive
                                                              ? "Sedang dibuka"
                                                              : "Belum dibuka"}
                                                    </span>
                                                </span>
                                            </Link>
                                        );
                                    })}

                                    {renderProgressCard()}
                                </>
                            ) : (
                                <>
                                    {menu.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                            className={`mobile-nav-link ${
                                                url.startsWith(item.href)
                                                    ? "mobile-nav-link-active"
                                                    : ""
                                            }`}
                                        >
                                            <item.icon className="mobile-nav-icon" />
                                            <span>{item.name}</span>
                                        </Link>
                                    ))}

                                    <Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="mobile-nav-link mobile-nav-logout"
                                    >
                                        <ArrowRightOnRectangleIcon className="mobile-nav-icon" />
                                        <span>Keluar</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    )}
                </nav>
            )}

            <div className="sidebar-column">
                <aside className="sidebar-shell flex">
                    {isCourseSidebar ? (
                        <div className="flex h-full flex-col">
                            <div>
                                <Link
                                    href={route("pertemuan", { id: courseId })}
                                    className="sidebar-back-link text-center"
                                >
                                    Kembali ke overview
                                </Link>

                                {steps.length > 0 && (
                                    <div className="mt-6 space-y-3 overflow-y-auto pr-1">
                                        {steps.map((item) => {
                                            const isActive =
                                                item.step === activeStep;
                                            const isDone =
                                                completedSteps >= item.step;
                                            const isUnlocked =
                                                item.step === 1 ||
                                                completedSteps >= item.step - 1;
                                            const StepIcon =
                                                item.icon ||
                                                stepIcons[item.step - 1] ||
                                                BookOpenIcon;

                                            return (
                                                <Link
                                                    key={item.step}
                                                    href={route(
                                                        "pertemuan.step",
                                                        {
                                                            id: courseId,
                                                            step: item.step,
                                                        },
                                                    )}
                                                    className={`course-sidebar-step ${
                                                        isActive
                                                            ? "course-sidebar-step-active"
                                                            : ""
                                                    } ${
                                                        !isUnlocked
                                                            ? "opacity-50 pointer-events-none"
                                                            : ""
                                                    }`}
                                                >
                                                    <span
                                                        className={`course-sidebar-step-icon ${isActive ? "course-sidebar-step-icon-active" : ""}`}
                                                    >
                                                        {isDone ? (
                                                            <CheckCircleIcon className="h-4 w-4" />
                                                        ) : isActive ? (
                                                            <PlayCircleIcon className="h-4 w-4" />
                                                        ) : (
                                                            <StepIcon className="h-4 w-4" />
                                                        )}
                                                    </span>

                                                    <span className="min-w-0 flex-1">
                                                        <span className="block truncate text-sm font-semibold">
                                                            {item.step}.{" "}
                                                            {item.title}
                                                        </span>
                                                        <span
                                                            className={`block text-xs ${isActive ? "text-[rgb(var(--color-primary))]/80" : "text-white/70"}`}
                                                        >
                                                            {isDone
                                                                ? "Selesai"
                                                                : isActive
                                                                  ? "Sedang dibuka"
                                                                  : isUnlocked
                                                                    ? "Belum dibuka"
                                                                    : "Terkunci"}
                                                        </span>
                                                    </span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto pt-6">
                                {renderProgressCard()}
                            </div>
                        </div>
                    ) : (
                        <>
                            <div>
                                <Link
                                    href="/beranda"
                                    className="mb-8 flex items-center gap-3 text-xl font-black tracking-wide transition hover:opacity-80"
                                >
                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-base text-[rgb(var(--color-primary))]">
                                        O
                                    </span>
                                    <span>OOPCODE</span>
                                </Link>

                                <div className="space-y-2">
                                    {menu.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`sidebar-link ${url.startsWith(item.href) ? "sidebar-link-active" : ""}`}
                                        >
                                            <item.icon className="h-5 w-5 shrink-0" />
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-auto pt-6">
                                <div className="mb-4">
                                    {renderProgressCard()}
                                </div>

                                {user && (
                                    <Link
                                        href={route("profile.edit")}
                                        className={`sidebar-profile-link mb-3 ${url === "/profile" ? "sidebar-link-active" : ""}`}
                                    >
                                        <UserCircleIcon className="h-9 w-9 shrink-0 text-white/85" />
                                        <div className="min-w-0 leading-tight">
                                            <div className="truncate text-sm font-bold">
                                                {user.name}
                                            </div>
                                            <div className="truncate text-xs font-medium text-white/70">
                                                {user.email}
                                            </div>
                                        </div>
                                    </Link>
                                )}

                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="sidebar-link w-full justify-start border border-white/10 bg-white/10 text-base font-semibold"
                                >
                                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                                    Keluar
                                </Link>
                            </div>
                        </>
                    )}
                </aside>
            </div>
        </>
    );
}
