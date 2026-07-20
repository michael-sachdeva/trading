import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-navy/5 bg-navy-900 text-white/70">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-14 md:grid-cols-4">
        <div className="col-span-2">
          <p className="font-display text-lg font-bold text-white">TradeMaster AI Academy</p>
          <p className="mt-3 max-w-sm text-sm text-white/50">
            AI-powered, bilingual trading education for Indian and global markets — from your
            first Demat account to institutional-grade strategy.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Company</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/#about">About Instructor</Link></li>
            <li><Link href="/#contact">Contact</Link></li>
            <li><Link href="/affiliate">Become an Affiliate</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Legal</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/terms">Terms of Service</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/refund-policy">Refund Policy</Link></li>
            <li><Link href="/risk-disclosure">Risk Disclosure</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-6 text-center text-xs text-white/40">
        © {new Date().getFullYear()} TradeMaster AI Academy. Educational content only — not
        investment advice.
      </div>
    </footer>
  );
}
