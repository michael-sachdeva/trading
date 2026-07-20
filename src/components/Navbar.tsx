import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-navy/5 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl font-bold text-navy">
          TradeMaster <span className="text-royal">AI</span> Academy
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <Link href="/#features" className="text-sm font-medium text-navy/70 hover:text-navy">
            Features
          </Link>
          <Link href="/#plans" className="text-sm font-medium text-navy/70 hover:text-navy">
            Plans
          </Link>
          <Link href="/#testimonials" className="text-sm font-medium text-navy/70 hover:text-navy">
            Testimonials
          </Link>
          <Link href="/#faq" className="text-sm font-medium text-navy/70 hover:text-navy">
            FAQ
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-semibold text-navy/70 hover:text-navy">
            Log in
          </Link>
          <Link href="/signup" className="btn-primary !px-5 !py-2 text-sm">
            Start Learning
          </Link>
        </div>
      </nav>
    </header>
  );
}
