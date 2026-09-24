import type { Metadata } from "next";
import SheIsSolanaLanding, { landingCopy } from "@/components/SheIsSolanaLanding";

export const metadata: Metadata = {
  title: "She Is Solana — Jornada para criar, validar e lançar ideias",
  description: "Iniciativa educacional e comunitária para formação e inclusão de mulheres em Web3 e Solana, criada pela Carol Labs com apoio da Superteam Brasil.",
};

export default function SheIsSolanaHome() {
  return <SheIsSolanaLanding copy={landingCopy.pt} />;
}
