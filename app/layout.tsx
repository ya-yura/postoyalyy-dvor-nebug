import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Постоялый двор — отдых в Небуге",
  description: "Подбор номера в частном секторе «Постоялый двор» в Небуге под свои даты и состав гостей.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
