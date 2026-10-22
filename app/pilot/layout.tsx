import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Founding Pilot | SatışDesk",
  description: "Explore the managed SatışDesk founding pilot: scope, onboarding, languages, and commercial conditions. No payment is collected on this page.",
  robots: { index: false, follow: false },
};

export default function PilotLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
