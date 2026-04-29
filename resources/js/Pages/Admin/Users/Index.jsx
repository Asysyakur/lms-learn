import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router, usePage } from "@inertiajs/react";

export default function Index({ users }) {
  const currentUser = usePage().props.auth?.user;

  function destroy(user) {
    if (confirm(`Hapus user "${user.name}"?`)) {
      router.delete(`/admin/users/${user.id}`);
    }
  }

  const formatScore = (attempt) => `${attempt.percentage} (${attempt.score}/${attempt.total_questions})`;

  return (
    <AdminLayout title="Pengguna">
      <div className="mb-4">
        <p className="text-sm text-slate-500">Daftar akun, role akses, dan nilai kuis siswa.</p>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
        <div className="hidden grid-cols-[1.1fr_1.2fr_100px_1.4fr_150px] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 md:grid">
          <div>Nama</div>
          <div>Email</div>
          <div>Role</div>
          <div>Nilai Kuis</div>
          <div className="text-right">Aksi</div>
        </div>

        {users.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">Belum ada user.</div>
        ) : (
          users.map((user) => (
            <div key={user.id} className="grid gap-3 border-b border-slate-100 p-4 last:border-b-0 md:grid-cols-[1.1fr_1.2fr_100px_1.4fr_150px] md:items-center">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400 md:hidden">
                  Nama
                </p>
                <p className="font-semibold text-slate-900">{user.name}</p>
                {currentUser?.id === user.id && (
                  <p className="text-xs font-semibold text-blue-700">Akun kamu</p>
                )}
              </div>

              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400 md:hidden">
                  Email
                </p>
                <p className="break-all text-sm text-slate-600">{user.email}</p>
              </div>

              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400 md:hidden">
                  Role
                </p>
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                  user.role === "admin"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-700"
                }`}>
                  {user.role}
                </span>
              </div>

              <div className="space-y-1.5">
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400 md:hidden">
                  Nilai Kuis
                </p>
                {user.quiz_attempts?.length > 0 ? (
                  user.quiz_attempts.map((attempt) => (
                    <div key={attempt.id} className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-semibold text-slate-700">
                        {attempt.quiz_title}
                      </span>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                        {formatScore(attempt)}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-slate-400">Belum mengerjakan kuis</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 md:flex md:justify-end">
                <Link className="rounded-lg border border-slate-200 px-3 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50" href={`/admin/users/${user.id}/edit`}>
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
