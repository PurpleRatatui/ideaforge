import type { Metadata } from "next";
import SheIsSolanaLanding, { landingCopy } from "@/components/SheIsSolanaLanding";

export const metadata: Metadata = {
  title: "She Is Solana — Education, community, and Solana",
  description: "Free classes, meetups, and mentorship for women who want to understand Web3 and build on Solana, by Carol Labs with support from Superteam Brazil.",
};

export default function SheIsSolanaEnglishHome() {
  return <SheIsSolanaLanding copy={landingCopy.en} />;
}
