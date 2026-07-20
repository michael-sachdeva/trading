import Link from "next/link";
import { TrendingUp, Brain, Globe2, ShieldCheck, LineChart, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingCard from "@/components/PricingCard";

const markets = [
  "Indian Stock Market",
  "US Stock Market",
  "Forex",
  "Commodity Trading",
  "Crypto Basics",
  "Options Buying",
  "Options Selling",
  "Nifty",
  "Bank Nifty",
  "Swing Trading",
  "Intraday",
  "Position Trading",
];

const features = [
  {
    icon: Brain,
    title: "AI-Powered Learning",
    desc: "An AI tutor that answers your doubts, summarizes lessons, and recommends what to study next.",
  },
  {
    icon: Globe2,
    title: "Hindi & English",
    desc: "Every lesson is available in both languages — switch anytime, no separate purchase.",
  },
  {
    icon: LineChart,
    title: "From Basics to Institutional",
    desc: "Structured tiers take you from your first Demat account to institutional-grade strategy.",
  },
  {
    icon: ShieldCheck,
    title: "Secure, Ad-Free Learning",
    desc: "Encrypted video streaming, no downloads, distraction-free study environment.",
  },
  {
    icon: TrendingUp,
    title: "Real Market Case Studies",
    desc: "Learn from actual Nifty, Bank Nifty, and global market scenarios — not theory alone.",
  },
  {
    icon: Award,
    title: "Certification",
    desc: "Earn a verifiable, QR-coded completion certificate for every course you finish.",
  },
];

const plans = [
  {
    slug: "free",
    name: "Free Preview",
    price: 0,
    features: [
      "Free Preview Lessons",
      "Basic Market Concepts",
      "No credit card required",
    ],
  },
  {
    slug: "basic",
    name: "Basic",
    price: 999,
    features: [
      "Beginner Course (Hindi + English)",
      "PDF Notes & Quizzes",
      "Basics of Stock Market, Demat, Candlesticks",
      "Support & Resistance, Risk Management",
      "Intro to Forex, Commodities, Nifty, Bank Nifty",
      "Lifetime Access + Certificate",
    ],
  },
  {
    slug: "advanced",
    name: "Advanced",
    price: 4999,
    highlighted: true,
    features: [
      "Everything in Basic",
      "Advanced Technical & Price Action Analysis",
      "Options Buying & Selling Strategies",
      "Swing, Intraday, Futures & Forex Trading",
      "Trading Psychology & Capital Management",
      "Case Studies + Assignments",
    ],
  },
  {
    slug: "master",
    name: "Master AI Program",
    price: 9999,
    features: [
      "Everything in Advanced",
      "100+ Hours Video Library",
      "AI Trading Assistant & Chat Tutor",
      "Trading Journal & Strategy Builder",
      "Global Markets: US, India, Forex, Commodities",
      "Institutional Concepts + Certification",
    ],
  },
];

const faqs = [
  {
    q: "Do I need any prior trading experience?",
    a: "No. The Basic plan starts from zero — what a Demat account is, how candlesticks work, and the fundamentals of risk management.",
  },
  {
    q: "Can I switch between Hindi and English?",
    a: "Yes, every lesson has both language versions and you can switch anytime from the video player.",
  },
  {
    q: "What happens if I want to upgrade my plan later?",
    a: "You only pay the price difference between your current plan and the new one — never the full price again.",
  },
  {
    q: "Is this financial advice?",
    a: "No. TradeMaster AI Academy is an educational platform. Course content teaches market concepts and analysis techniques; it is not personalized investment advice.",
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-hero-gradient px-6 pb-20 pt-16 md:pt-24">
          <div className="mx-auto max-w-5xl text-center">
            <span className="inline-block rounded-full bg-royal-50 px-4 py-1.5 text-xs font-semibold text-royal-700">
              AI-Powered · Bilingual · Beginner to Institutional
            </span>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight text-navy md:text-6xl">
              Master Indian &amp; Global Trading <br className="hidden md:block" />
              with <span className="text-royal">AI-Powered Learning</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-navy/60">
              Learn Indian &amp; US stock markets, Forex, Commodities, Options and Crypto —
              taught in Hindi and English, with an AI tutor guiding every step.
            </p>

            <div className="mx-auto mt-8 flex flex-wrap justify-center gap-2">
              {markets.slice(0, 8).map((m) => (
                <span
                  key={m}
                  className="rounded-full border border-navy/10 bg-white px-3 py-1 text-xs font-medium text-navy/60"
                >
                  {m}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/signup" className="btn-primary px-8 py-4 text-base">
                Start Learning for ₹999
              </Link>
              <Link href="#plans" className="btn-secondary px-8 py-4 text-base">
                Compare Plans
              </Link>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="text-center font-display text-3xl font-bold text-navy">
            Built for serious traders-in-training
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-royal-50">
                  <Icon className="h-5 w-5 text-royal" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-navy">{title}</h3>
                <p className="mt-2 text-sm text-navy/60">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PLANS */}
        <section id="plans" className="bg-navy-900 px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-center font-display text-3xl font-bold text-white">
              Choose your plan
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-center text-white/50">
              Start with Basic and upgrade anytime — you'll only ever pay the difference.
            </p>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {plans.map((p) => (
                <PricingCard key={p.slug} {...p} />
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="text-center font-display text-3xl font-bold text-navy">
            Success Stories
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card">
                <p className="text-sm text-navy/70">
                  "The Hindi explanations made options trading finally click for me. The
                  structured modules meant I never felt lost."
                </p>
                <p className="mt-4 text-sm font-semibold text-navy">Student, Advanced Plan</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl px-6 py-20">
          <h2 className="text-center font-display text-3xl font-bold text-navy">
            Frequently asked questions
          </h2>
          <div className="mt-10 space-y-4">
            {faqs.map(({ q, a }) => (
              <details key={q} className="card group cursor-pointer">
                <summary className="font-semibold text-navy marker:content-none">{q}</summary>
                <p className="mt-3 text-sm text-navy/60">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="bg-royal-50 px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-navy">Still have questions?</h2>
            <p className="mt-2 text-navy/60">Our team replies within one business day.</p>
            <Link href="/contact" className="btn-primary mt-6 inline-flex px-8 py-4">
              Contact Us
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
