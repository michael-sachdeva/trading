import Link from "next/link";
import { LayoutDashboard, BookOpen, Award, CreditCard, ArrowUpCircle } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/courses", label: "My Courses", icon: BookOpen },
  { href: "/dashboard/certificates", label: "Certificates", icon: Award },
  { href: "/dashboard/payments", label: "Payment History", icon: CreditCard },
  { href: "/dashboard/upgrade", label: "Upgrade Plan", icon: ArrowUpCircle },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-hero-gradient">
      <aside className="hidden w-64 shrink-0 border-r border-navy/5 bg-white p-6 md:block">
        <Link href="/" className="font-display text-lg font-bold text-navy">
          TradeMaster <span className="text-royal">AI</span>
        </Link>
        <nav className="mt-8 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-navy/70 hover:bg-royal-50 hover:text-royal"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 p-6 md:p-10">{children}</div>
    </div>
  );
}
