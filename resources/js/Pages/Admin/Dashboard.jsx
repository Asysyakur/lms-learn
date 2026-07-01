import AdminLayout from "@/Layouts/AdminLayout";
import { Link } from "@inertiajs/react";
import {
  BookOpenIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  const items = [
    {
      title: "Pertemuan",
      href: "/admin/meetings",
      description: "Atur pertemuan dan step belajar.",
      icon: BookOpenIcon,
      color: "bg-emerald-600",
    },
    {
      title: "Tes",
      href: "/admin/quiz-sets",
      description: "Kelola pre-test dan post-test.",
      icon: ClipboardDocumentListIcon,
      color: "bg-violet-600",
    },
  ];

  return (
    <AdminLayout title="Dasbor">
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-lg ${item.color} text-white`}>
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
            </Link>
          );
        })}
      </div>
    </AdminLayout>
  );
}
