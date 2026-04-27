import { Link, usePage } from "@inertiajs/react";
import {
  AcademicCapIcon,
  ArrowRightOnRectangleIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  HomeIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";

export default function AdminSidebar() {
  const { url, props } = usePage();
  const user = props.auth?.user;

  const menu = [
    { name: "Dashboard", href: "/admin", icon: HomeIcon },
    { name: "Courses", href: "/admin/courses", icon: AcademicCapIcon },
    { name: "Meetings", href: "/admin/meetings", icon: BookOpenIcon },
    { name: "Quiz", href: "/admin/quiz-sets", icon: ClipboardDocumentListIcon },
    { name: "Users", href: "/admin/users", icon: UsersIcon },
  ];

  return (
    <>
      <nav className="mobile-navbar md:hidden">
        <div className="flex items-center gap-2 text-lg font-black tracking-wide text-white">
          <BookOpenIcon className="h-5 w-5" />
          <span>ADMIN</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto px-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/admin" ? url === "/admin" : url.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`mobile-nav-link ${active ? "mobile-nav-link-active" : ""}`}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}

          <Link href={route("logout")} method="post" as="button" className="mobile-nav-link mobile-nav-logout">
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            Logout
          </Link>
        </div>
      </nav>

      <aside className="sidebar-shell hidden md:flex md:h-screen md:w-64">
        <div>
          <div className="mb-8 flex items-center gap-2 text-xl font-black tracking-wide">
            <BookOpenIcon className="h-6 w-6" />
            <span>ADMIN</span>
          </div>

          <div className="space-y-2">
            {menu.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === "/admin" ? url === "/admin" : url.startsWith(item.href);

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

        <div className="mt-auto pt-6">
          {user && (
            <div className="mb-3 rounded-xl bg-white/10 px-4 py-3 text-sm">
              <div className="font-semibold">{user.name}</div>
              <div className="text-white/70">{user.email}</div>
            </div>
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
      </aside>
    </>
  );
}
