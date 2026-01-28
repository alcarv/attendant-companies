import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Mattos Tech Solutions",
  description: "SaaS de atendimento via WhatsApp"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="page">{children}</div>
      </body>
    </html>
  );
}
