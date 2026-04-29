import { Link, usePage } from "@inertiajs/react";
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentCheckIcon,
  HomeIcon,
  PlayCircleIcon,
  QuestionMarkCircleIcon,
  Squares2X2Icon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
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
}) {
  const { url, props } = usePage();
  const user = props.auth?.user;

  const menu = [
    { name: "Home", href: "/beranda", icon: HomeIcon },
    { name: "Kuis", href: "/kuis", icon: QuestionMarkCircleIcon },
    { name: "About", href: "/about", icon: Squares2X2Icon },
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

  return (
    <>
      {showMobileNav && (
        <nav className="mobile-navbar md:hidden">
          <div className="flex items-center gap-2 text-lg font-black tracking-wide text-white">
            <BookOpenIcon className="h-5 w-5" />
            <span>LOGO</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto px-2">
            {menu.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`mobile-nav-link ${
                  url.startsWith(item.href) ? "mobile-nav-link-active" : ""
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}

            <Link href={route("logout")} method="post" as="button" className="mobile-nav-link mobile-nav-logout">
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              Logout
            </Link>
          </div>
        </nav>
      )}

      <div className="sidebar-column">
        <aside className="sidebar-shell md:flex">
          {isCourseSidebar ? (
            <div>
              <Link href={route("pertemuan", { id: courseId })} className="sidebar-back-link text-center">
                <ArrowLeftIcon className="h-5 w-5" />
                Kembali ke overview
              </Link>

              <div className="mt-6 space-y-3">
                {steps.map((item) => {
                  const isActive = item.step === activeStep;
                  const isDone = item.step < activeStep;
                  const StepIcon = item.icon || stepIcons[item.step - 1] || BookOpenIcon;

                  return (
                    <Link
                      key={item.step}
                      href={route("pertemuan.step", { id: courseId, step: item.step })}
                      className={`course-sidebar-step ${isActive ? "course-sidebar-step-active" : ""}`}
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
                          {item.step}. {item.title}
                        </span>
                        <span
                          className={`block text-xs ${isActive ? "text-[rgb(var(--color-primary))]/80" : "text-white/70"}`}
                        >
                          {isDone ? "Selesai" : isActive ? "Sedang dibuka" : "Belum dibuka"}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              <div>
                <div className="mb-8 flex items-center gap-2 text-xl font-black tracking-wide">
                  <BookOpenIcon className="h-6 w-6" />
                  <span>LOGO</span>
                </div>

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
                {user && (
                  <Link
                    href={route("profile.edit")}
                    className={`sidebar-profile-link mb-3 ${url === "/profile" ? "sidebar-link-active" : ""}`}
                  >
                    <UserCircleIcon className="h-9 w-9 shrink-0 text-white/85" />
                    <div className="min-w-0 leading-tight">
                      <div className="truncate text-sm font-bold">{user.name}</div>
                      <div className="truncate text-xs font-medium text-white/70">{user.email}</div>
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
                  Logout
                </Link>
              </div>
            </>
          )}
        </aside>
      </div>
    </>
  );
}
