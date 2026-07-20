import Link from "next/link";
import { Check } from "lucide-react";

type Props = {
  name: string;
  price: number;
  slug: string;
  features: string[];
  highlighted?: boolean;
};

export default function PricingCard({ name, price, slug, features, highlighted }: Props) {
  return (
    <div
      className={`card flex flex-col ${
        highlighted ? "border-2 border-royal shadow-soft-lg md:-translate-y-3" : ""
      }`}
    >
      {highlighted && (
        <span className="mb-3 w-fit rounded-full bg-blue-gradient px-3 py-1 text-xs font-semibold text-white">
          Most Popular
        </span>
      )}
      <h3 className="font-display text-xl font-bold text-navy">{name}</h3>
      <p className="mt-2 font-display text-4xl font-extrabold text-navy">
        ₹{price.toLocaleString("en-IN")}
      </p>
      <p className="text-sm text-navy/50">one-time · lifetime access</p>

      <ul className="mt-6 flex-1 space-y-3">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-navy/70">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-royal" />
            {f}
          </li>
        ))}
      </ul>

      <Link
        href={`/checkout?plan=${slug}`}
        className={highlighted ? "btn-primary mt-8 w-full" : "btn-secondary mt-8 w-full"}
      >
        Get {name}
      </Link>
    </div>
  );
}
