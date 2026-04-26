import Sidebar from "@/Components/Sidebar";

export default function AppLayout({ children, title }) {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 min-h-screen bg-background">
        <div className="app-surface flex items-center px-6 py-4">
          <h1 className="app-section-title">{title}</h1>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}