import type { Metadata } from "next";
import localFont from "next/font/local";
import { localContactPreviewEnabled } from "@/lib/contact/preview";
import { ContactProvider } from "@/components/site/contact";
import "./globals.css";
import "./contact.css";

const manrope = localFont({
  src: "../../public/fonts/Manrope-Variable.ttf",
  weight: "200 800",
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? (process.env.VERCEL === "1" ? "https://casa-foerderverein.de" : "http://localhost:3016")),
  title: "CASA Förderverein e.V. – Raum für Miteinander",
  description: "Sprache, Teilhabe und Begegnung. Der CASA-Förderverein e.V. unterstützt Menschen auf ihrem Lernweg und Projekte der CASA Sprachschule.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "CASA Förderverein e.V. – Raum für Miteinander",
    description: "Miteinander reden. Aufeinander zugehen.",
    locale: "de_DE",
    type: "website",
    images: [{ url: "/brand/social-banner.png", width: 1200, height: 630, alt: "CASA Förderverein – Miteinander reden. Aufeinander zugehen." }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="de" className={manrope.variable}><body><ContactProvider previewEnabled={localContactPreviewEnabled()}>{children}</ContactProvider></body></html>;
}
