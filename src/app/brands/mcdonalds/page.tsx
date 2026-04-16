import type { Metadata } from "next"
import BrandPage from "@/components/brand-page/BrandPage"
import { mcdonaldsBrandPage } from "@/lib/brand-pages/mcdonalds"

export const metadata: Metadata = {
  title: "McDonald's Franchise — FDD Data, Fees & Item 19",
  description:
    "McDonald's franchise: $1.47M–$2.73M initial investment, $45,000 initial fee, 4–5% royalty. Average unit revenue $4.00M across 12,572 traditional restaurants. Sourced from the 2025 government-filed FDD (file #638437).",
  alternates: {
    canonical: "https://franchisel.com/brands/mcdonalds",
  },
  openGraph: {
    title: "McDonald's Franchise — FDD Data, Fees & Item 19",
    description:
      "Guided walk-through of the 2025 McDonald's FDD: investment range, ongoing fee stack, Item 19 revenue quality, system stability, contract burden, and state overrides.",
  },
}

export default function McDonaldsPage() {
  return <BrandPage model={mcdonaldsBrandPage} />
}
