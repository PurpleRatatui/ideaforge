import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "She Is Solana",
  description: "Iniciativa educacional e comunitária da Carol Labs com apoio da Superteam Brasil para aprender, validar ideias e construir no ecossistema Solana.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
