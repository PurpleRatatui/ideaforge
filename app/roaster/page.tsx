import type { Metadata } from "next";
import IdeaRoasterPage from "@/components/IdeaRoasterPage";

export const metadata: Metadata = {
  title: "Idea Roaster — She Is Solana",
  description: "Teste sua ideia para o hackathon: receba um roast, reconstrua a proposta e gere um plano de go-to-market com Hivemind.",
};

export default function RoasterPage() {
  return <IdeaRoasterPage />;
}
