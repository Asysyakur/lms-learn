import Sidebar from "@/Components/Sidebar";

export default function AppLayout({
  children,
  title,
  showTitleBar = true,
  showMobileNav = true,
  sidebarVariant = "default",
  sidebarProps = {},
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar showMobileNav={showMobileNav} variant={sidebarVariant} {...sidebarProps} />

      <div className="min-h-screen flex-1 bg-white p-0 sm:p-0">
        {showTitleBar ? (
          <div className="flex h-full min-h-[calc(100vh-1rem)] flex-col overflow-hidden rounded-none bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)] sm:rounded-3xl">
            <div className="app-topbar pt-[env(safe-area-inset-top)] md:pt-4">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                {title}
              </h1>
            </div>

            <div className="flex-1 p-4 sm:p-6">{children}</div>
          </div>
        ) : (
          <div className="min-h-screen bg-slate-100">{children}</div>
        )}
      </div>
    </div>
  );
}