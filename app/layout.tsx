import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "She Is Solana",
  description: "Jornada She Is Solana para aprender, validar ideias e se preparar para hackathons como a Colosseum.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
