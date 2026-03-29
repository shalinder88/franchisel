import Link from "next/link";

export const metadata = {
  title: "Admin | Franchisel",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-lg font-bold tracking-tight">
              Franchisel <span className="text-xs font-normal bg-red-500 px-2 py-0.5 rounded ml-2">ADMIN</span>
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/admin" className="text-gray-300 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/admin/brands" className="text-gray-300 hover:text-white transition-colors">
                Brands
              </Link>
              <Link href="/admin/brands/new" className="text-gray-300 hover:text-white transition-colors">
                + Add Brand
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              View Site
            </Link>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>
    </div>
  );
}
