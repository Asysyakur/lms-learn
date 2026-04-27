import AdminSidebar from "@/Components/AdminSidebar";
import { Head, usePage } from "@inertiajs/react";

export default function AdminLayout({ children, title }) {
  const { auth } = usePage().props;

  return (
    <>
      <Head title={title} />

      <div className="flex min-h-screen flex-col md:flex-row">
        <AdminSidebar />

        <div className="min-h-screen flex-1 bg-white p-0 sm:p-0">
          <div className="flex h-full min-h-[calc(100vh-1rem)] flex-col overflow-hidden rounded-none bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)] sm:rounded-3xl">
            <div className="app-topbar pt-[env(safe-area-inset-top)] md:pt-4">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                {title}
              </h1>
              <div className="text-sm font-semibold text-slate-600">
                {auth?.user?.name ?? "Admin"}
              </div>
            </div>

            <div className="flex-1 p-4 sm:p-6">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
