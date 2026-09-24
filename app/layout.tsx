import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "She Is Solana",
  description: "Aulas gratuitas, encontros e mentorias para mulheres que querem entender Web3 e construir na Solana, por Carol Labs com apoio da Superteam Brasil.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
