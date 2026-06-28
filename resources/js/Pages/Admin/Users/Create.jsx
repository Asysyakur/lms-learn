import AdminLayout from "@/Layouts/AdminLayout";
import { Link, useForm } from "@inertiajs/react";

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    email: "",
    role: "student",
    password: "",
    password_confirmation: "",
  });

  function submit(e) {
    e.preventDefault();
    post("/admin/users");
  }

  return (
    <AdminLayout title="Tambah Siswa">
      <form onSubmit={submit} className="max-w-2xl rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <label className="block text-sm font-semibold text-slate-700">Nama</label>
        <input
          className="mt-1 w-full rounded-lg border-slate-300"
          value={data.name}
          onChange={(e) => setData("name", e.target.value)}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}

        <label className="mt-4 block text-sm font-semibold text-slate-700">Email</label>
        <input
          className="mt-1 w-full rounded-lg border-slate-300"
          type="email"
          value={data.email}
          onChange={(e) => setData("email", e.target.value)}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}

        <label className="mt-4 block text-sm font-semibold text-slate-700">Role</label>
        <select
          className="mt-1 w-full rounded-lg border-slate-300"
          value={data.role}
          onChange={(e) => setData("role", e.target.value)}
        >
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
        {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}

        <label className="mt-4 block text-sm font-semibold text-slate-700">Password</label>
        <input
          className="mt-1 w-full rounded-lg border-slate-300"
          type="password"
          value={data.password}
          onChange={(e) => setData("password", e.target.value)}
        />
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}

        <label className="mt-4 block text-sm font-semibold text-slate-700">Konfirmasi Password</label>
        <input
          className="mt-1 w-full rounded-lg border-slate-300"
          type="password"
          value={data.password_confirmation}
          onChange={(e) => setData("password_confirmation", e.target.value)}
        />

        <div className="mt-5 flex gap-2">
          <button disabled={processing} className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-yellow-500 disabled:opacity-60" type="submit">
            Simpan
          </button>
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" href="/admin/users">
            Batal
          </Link>
        </div>
      </form>
    </AdminLayout>
  );
}
