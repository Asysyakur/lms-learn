import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router, usePage } from "@inertiajs/react";

export default function Index({ users }) {
  const currentUser = usePage().props.auth?.user;

  function destroy(user) {
    if (confirm(`Hapus user "${user.name}"?`)) {
      router.delete(`/admin/users/${user.id}`);
    }
  }

  return (
    <AdminLayout title="Pengguna">
      <div className="mb-4">
        <p className="text-sm text-slate-500">Daftar akun dan role akses admin.</p>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
        <div className="hidden grid-cols-[1.2fr_1.4fr_120px_160px] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 md:grid">
          <div>Nama</div>
          <div>Email</div>
          <div>Role</div>
          <div className="text-right">Aksi</div>
        </div>

        {users.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">Belum ada user.</div>
        ) : (
          users.map((user) => (
            <div key={user.id} className="grid gap-3 border-b border-slate-100 p-4 last:border-b-0 md:grid-cols-[1.2fr_1.4fr_120px_160px] md:items-center">
              <div>
                <p className="font-semibold text-slate-900">{user.name}</p>
                {currentUser?.id === user.id && (
                  <p className="text-xs font-semibold text-blue-700">Akun kamu</p>
                )}
              </div>

              <div className="text-sm text-slate-600">{user.email}</div>

              <div>
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                  user.role === "admin"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-700"
                }`}>
                  {user.role}
                </span>
              </div>

              <div className="flex gap-2 md:justify-end">
                <Link className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" href={`/admin/users/${user.id}/edit`}>
                  Ubah
                </Link>
                <button
                  className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  type="button"
                  disabled={currentUser?.id === user.id}
                  onClick={() => destroy(user)}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
