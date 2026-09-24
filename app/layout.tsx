import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Idea Forge — Roast it. Rebuild it. Take it to market.",
  description: "Put your startup idea under pressure with KillMyIdea, then use the feedback to create a stronger idea and a practical go-to-market plan with Hivemind.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
