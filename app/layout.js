import { Playfair_Display, Plus_Jakarta_Sans, Dancing_Script } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const dancing = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
  display: "swap",
});

export const metadata = {
  title: "OUR LITTLE UNIVERSE — Kisah Cinta Kita",
  description: "Every love story has a universe. This one is ours. Sebuah ruang digital penuh cinta, kenangan, dan janji masa depan.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${jakarta.variable} ${dancing.variable} font-sans bg-ivory text-burgundy antialiased selection:bg-dustyRose selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
