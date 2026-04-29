import AdminLayout from "@/Layouts/AdminLayout";
import StepForm from "./Form";

export default function Edit({ step }) {
  return (
    <AdminLayout title="Ubah Langkah">
      <StepForm step={step} />
    </AdminLayout>
  );
}
