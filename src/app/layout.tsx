import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DaruGear — Gear Calculator",
  description: "ArcheAge Classic gear calculator interface",
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en"><body>{children}</body></html>;
}
