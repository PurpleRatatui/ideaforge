import type { Metadata } from "next";
import IdeaRoasterPageEn from "@/components/IdeaRoasterPageEn";

export const metadata: Metadata = {
  title: "Idea Roaster — Test your Colosseum idea",
  description: "Stress-test a hackathon idea, find weak spots, and use Hivemind to adjust the proposal, MVP, and go-to-market plan.",
};

export default function EnglishRoasterPage() {
  return <IdeaRoasterPageEn />;
}
