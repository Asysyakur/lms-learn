import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import {
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    BookOpenIcon,
    ClipboardDocumentCheckIcon,
    ClipboardDocumentListIcon,
    HomeIcon,
    QuestionMarkCircleIcon,
    UsersIcon,
    UserCircleIcon,
    XMarkIcon,
} from "@heroicons/react/24/solid";

export default function AdminSidebar() {
    const { url, props } = usePage();
    const user = props.auth?.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const menu = [
        { name: "Pertemuan", href: "/admin/meetings", icon: BookOpenIcon },
        {
            name: "Kuis",
            href: "/admin/quiz-sets",
            icon: ClipboardDocumentListIcon,
        },
        {
            name: "Hasil Kuis",
            href: "/admin/quiz-results",
            icon: ClipboardDocumentCheckIcon,
        },
        { name: "Pengguna", href: "/admin/users", icon: UsersIcon },
    ];

    return (
        <>
            <nav className="mobile-navbar md:hidden">
                <div className="mobile-navbar-row">
                    <Link
                        href="/admin"
                        className="mb-8 flex items-center gap-2 text-xl font-black tracking-wide transition hover:opacity-80"
                    >
                        <BookOpenIcon className="h-6 w-6" />
                        <span>OOPCODE GURU</span>
                    </Link>

                    <button
                        type="button"
                        className="mobile-menu-button"
                        onClick={() => setMobileMenuOpen((open) => !open)}
                        aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
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
                        {menu.map((item) => {
                            const Icon = item.icon;
                            const active =
                                item.href === "/admin"
                                    ? url === "/admin"
                                    : url.startsWith(item.href);

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`mobile-nav-link ${active ? "mobile-nav-link-active" : ""}`}
                                >
                                    <Icon className="mobile-nav-icon" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}

                        <Link
                            href={route("profile.edit")}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`mobile-nav-link ${url === "/profile" ? "mobile-nav-link-active" : ""}`}
                        >
                            <UserCircleIcon className="mobile-nav-icon" />
                            <span>Profil</span>
                        </Link>

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
                    </div>
                )}
            </nav>

            <div className="sidebar-column">
                <aside className="sidebar-shell md:flex">
                    <div>
                        <Link
                            href="/admin"
                            className="mb-8 flex items-center gap-2 text-xl font-black tracking-wide transition hover:opacity-80"
                        >
                            <BookOpenIcon className="h-6 w-6" />
                            <span>OOPCODE GURU</span>
                        </Link>

                        <div className="space-y-2">
                            {menu.map((item) => {
                                const Icon = item.icon;
                                const active =
                                    item.href === "/admin"
                                        ? url === "/admin"
                                        : url.startsWith(item.href);

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`sidebar-link ${active ? "sidebar-link-active" : ""}`}
                                    >
                                        <Icon className="h-5 w-5 shrink-0" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-auto pt-6 gap-3 flex flex-col">
                        {user && (
                            <Link
                                href={route("profile.edit")}
                                className={`sidebar-profile-link ${url === "/profile" ? "sidebar-link-active" : ""}`}
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
                </aside>
            </div>
        </>
    );
}
