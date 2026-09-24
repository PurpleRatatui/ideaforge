import type { Metadata } from "next";
import IdeaRoasterPage from "@/components/IdeaRoasterPage";

export const metadata: Metadata = {
  title: "Idea Roaster — Teste sua ideia para a Colosseum",
  description: "Teste uma ideia de hackathon, veja os pontos fracos e use Hivemind para ajustar proposta, MVP e go-to-market.",
};

export default function RoasterPage() {
  return <IdeaRoasterPage />;
}
