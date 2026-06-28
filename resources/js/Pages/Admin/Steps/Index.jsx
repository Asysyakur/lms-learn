import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router } from "@inertiajs/react";
import { useState } from "react";
import StepForm, { STEP_TYPES } from "./Form";

function stepTypeLabel(stepType) {
  return STEP_TYPES.find((type) => type.value === stepType)?.label ?? stepType;
}

export default function Index({ steps, meetingId }) {
  const [showForm, setShowForm] = useState(false);

  function destroy(step) {
    if (confirm(`Hapus step "${step.title}"?`)) {
      router.delete(`/admin/steps/${step.id}`);
    }
  }

  return (
    <AdminLayout title="Steps">
      <div className="mb-4">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-yellow-500"
          >
            Tambah Step
          </button>
        ) : (
          <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Form Tambah Step</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-sm font-semibold text-slate-500 hover:text-slate-700"
              >
                Tutup
              </button>
            </div>
            <StepForm
              meetingId={meetingId}
              meetingSteps={steps}
              onSuccess={() => setShowForm(false)}
            />
          </div>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {steps.length === 0 ? (
          <div className="rounded-lg bg-white p-6 text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">
            Belum ada step untuk meeting ini.
          </div>
        ) : (
          steps.map((step) => (
            <div key={step.id} className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
                    Step {step.step_number} / {stepTypeLabel(step.step_type)}
                  </p>
                  <h3 className="mt-1 font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{step.description}</p>
                </div>

                <div className="flex gap-2">
                  <Link className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" href={`/admin/steps/${step.id}/edit`}>
                    Ubah
                  </Link>
                  <button className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50" type="button" onClick={() => destroy(step)}>
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
