import type { Metadata } from "next";
import SheIsSolanaLanding, { landingCopy } from "@/components/SheIsSolanaLanding";

export const metadata: Metadata = {
  title: "She Is Solana — Learn, validate, and launch ideas",
  description: "An educational and community initiative for the training and inclusion of women in Web3 and Solana, created by Carol Labs with support from Superteam Brazil.",
};

export default function SheIsSolanaEnglishHome() {
  return <SheIsSolanaLanding copy={landingCopy.en} />;
}
