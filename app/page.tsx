import type { Metadata } from "next";
import SheIsSolanaLanding, { landingCopy } from "@/components/SheIsSolanaLanding";

export const metadata: Metadata = {
  title: "She Is Solana — Educação, comunidade e Solana",
  description: "Aulas gratuitas, encontros e mentorias para mulheres que querem entender Web3 e construir na Solana, por Carol Labs com apoio da Superteam Brasil.",
};

export default function SheIsSolanaHome() {
  return <SheIsSolanaLanding copy={landingCopy.pt} />;
}
