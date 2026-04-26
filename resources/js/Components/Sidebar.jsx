import { Link, usePage } from "@inertiajs/react";

export default function Sidebar() {
  const { url, props } = usePage();
  const user = props.auth?.user;

  const menu = [
    { name: "Beranda", href: "/beranda" },
    { name: "Kuis", href: "/kuis" },
    { name: "About", href: "/about" },
  ];

  return (
    <div className="sidebar-shell">
      <div>
        <h1 className="mb-8 text-xl font-bold">LOGO</h1>

        <div className="space-y-2">
          {menu.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`sidebar-link ${
                url.startsWith(item.href) ? "sidebar-link-active" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
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
          className="btn-outline w-full justify-start"
        >
          Logout
        </Link>
      </div>
    </div>
  );
}