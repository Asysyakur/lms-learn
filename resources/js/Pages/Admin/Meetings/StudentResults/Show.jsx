import AdminLayout from "@/Layouts/AdminLayout";
import { Link } from "@inertiajs/react";

export default function Show({ meeting, student, responses = [] }) {
    return (
        <AdminLayout title="Detail Hasil Siswa">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Detail Hasil Siswa
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            {student.name} • {meeting.title}
                        </p>
                    </div>

                    <Link
                        href={route(
                            "admin.meetings.student-results",
                            meeting.id,
                        )}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        Kembali
                    </Link>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <p className="text-sm text-slate-500">Nama</p>

                            <h2 className="mt-1 font-semibold text-slate-900">
                                {student.name}
                            </h2>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">Email</p>

                            <h2 className="mt-1 font-semibold text-slate-900">
                                {student.email}
                            </h2>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">
                                Total Response
                            </p>

                            <h2 className="mt-1 font-semibold text-slate-900">
                                {responses.length}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {responses.map((response, index) => {
                        console.log(response);
                        return (
                            <div
                                key={index}
                                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                            >
                                <div className="mb-4">
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        {response.step_title || "Step"}
                                    </h2>

                                    <p className="text-sm text-slate-500">
                                        {response.type}
                                    </p>
                                </div>

                                {response.type === "Exploration" &&
                                Array.isArray(response.answer) ? (
                                    <div className="space-y-6">
                                        {response.answer.map(
                                            (mission, missionIndex) => (
                                                <div
                                                    key={missionIndex}
                                                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                                                >
                                                    <div className="mb-4 rounded-xl border border-orange-200 bg-orange-50 p-4">
                                                        <div className="text-sm font-semibold text-orange-700">
                                                            {mission.mission_title ||
                                                                `Mission ${missionIndex + 1}`}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        {mission.items?.map(
                                                            (
                                                                item,
                                                                itemIndex,
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        itemIndex
                                                                    }
                                                                    className="rounded-xl border border-slate-200 bg-white p-4"
                                                                >
                                                                    <div className="mb-2 text-sm font-semibold text-blue-700">
                                                                        Pertanyaan{" "}
                                                                        {itemIndex +
                                                                            1}
                                                                    </div>

                                                                    <div className="mb-4 whitespace-pre-wrap text-sm text-slate-700">
                                                                        {
                                                                            item.question
                                                                        }
                                                                    </div>

                                                                    <div className="rounded-lg bg-slate-50 p-3">
                                                                        <div className="mb-1 text-xs font-semibold text-slate-500">
                                                                            Jawaban
                                                                            Siswa
                                                                        </div>

                                                                        <div className="whitespace-pre-wrap text-sm text-slate-700">
                                                                            {item.answer ||
                                                                                "-"}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                ) : response.type === "Review" &&
                                  Array.isArray(response.items) ? (
                                    <div className="space-y-6">
                                        {response.items.map(
                                            (item, itemIndex) => (
                                                <div
                                                    key={itemIndex}
                                                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                                                >
                                                    <div className="mb-4">
                                                        <div className="mb-2 text-sm font-semibold text-blue-700">
                                                            Pertanyaan{" "}
                                                            {itemIndex + 1}
                                                        </div>

                                                        <div className="whitespace-pre-wrap text-sm text-slate-700">
                                                            {item.question}
                                                        </div>
                                                    </div>

                                                    <div className="mb-4 rounded-xl bg-white p-4">
                                                        <div className="mb-2 text-xs font-semibold text-slate-500">
                                                            Jawaban Awal Siswa
                                                        </div>

                                                        <div className="whitespace-pre-wrap text-sm text-slate-700">
                                                            {item.student_answer ||
                                                                "-"}
                                                        </div>
                                                    </div>

                                                    <div className="mb-4 rounded-xl bg-white p-4">
                                                        <div className="mb-2 text-xs font-semibold text-slate-500">
                                                            Pembuktian & Argumen
                                                        </div>

                                                        <div className="whitespace-pre-wrap text-sm text-slate-700">
                                                            {item.review_answer ||
                                                                "-"}
                                                        </div>
                                                    </div>

                                                    {item.evidence && (
                                                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                                                            <img
                                                                src={
                                                                    item.evidence
                                                                }
                                                                alt="Bukti"
                                                                className="max-h-[400px] w-full object-contain"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                ) : response.items ? (
                                    <div className="space-y-4">
                                        {" "}
                                        {response.items.map(
                                            (item, itemIndex) => (
                                                <div
                                                    key={itemIndex}
                                                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                                                >
                                                    {" "}
                                                    <div className="mb-2 text-sm font-semibold text-blue-700">
                                                        {" "}
                                                        Pertanyaan{" "}
                                                        {itemIndex + 1}{" "}
                                                    </div>{" "}
                                                    <div className="mb-4 whitespace-pre-wrap text-sm text-slate-700">
                                                        {" "}
                                                        {item.question}{" "}
                                                    </div>{" "}
                                                    {item.mode === "quiz" &&
                                                        item.options && (
                                                            <div className="mb-4 space-y-2">
                                                                {" "}
                                                                {item.options.map(
                                                                    (
                                                                        option,
                                                                        optionIndex,
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                optionIndex
                                                                            }
                                                                            className={`rounded-lg border px-3 py-2 text-sm ${item.answer === option ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-700"}`}
                                                                        >
                                                                            {" "}
                                                                            {
                                                                                option
                                                                            }{" "}
                                                                        </div>
                                                                    ),
                                                                )}{" "}
                                                            </div>
                                                        )}{" "}
                                                    <div className="rounded-lg bg-white p-3">
                                                        {" "}
                                                        <div className="mb-1 text-xs font-semibold text-slate-500">
                                                            {" "}
                                                            Jawaban Siswa{" "}
                                                        </div>{" "}
                                                        <div className="whitespace-pre-wrap text-sm text-slate-700">
                                                            {" "}
                                                            {item.answer ||
                                                                "-"}{" "}
                                                        </div>{" "}
                                                    </div>{" "}
                                                </div>
                                            ),
                                        )}{" "}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {" "}
                                        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                                            {" "}
                                            <div className="mb-2 text-sm font-semibold text-blue-700">
                                                {" "}
                                                Pertanyaan{" "}
                                            </div>{" "}
                                            <div className="whitespace-pre-wrap text-sm text-slate-700">
                                                {" "}
                                                {response.question || "-"}{" "}
                                            </div>{" "}
                                        </div>{" "}
                                        <div className="rounded-xl bg-slate-50 p-4">
                                            {" "}
                                            <div className="mb-2 text-sm font-semibold text-slate-700">
                                                {" "}
                                                Jawaban Siswa{" "}
                                            </div>{" "}
                                            <pre className="whitespace-pre-wrap break-words text-sm text-slate-700">
                                                {" "}
                                                {response.answer || "-"}{" "}
                                            </pre>{" "}
                                        </div>{" "}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {responses.length === 0 && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
                            Belum ada response siswa.
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
