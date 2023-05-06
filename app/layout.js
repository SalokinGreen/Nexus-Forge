import "./globals.css";
import { Inter } from "next/font/google";
import SupabaseProvider from "./supabase-provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: process.env.WORLD_TITLE ? process.env.WORLD_TITLE : "Nexus-Forge",
  description: process.env.WORLD_DESC
    ? process.env.WORLD_DESC
    : "A place to forge and share your worlds.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseProvider>{children}</SupabaseProvider>
      </body>
    </html>
  );
}
