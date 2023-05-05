import "./globals.css";
import { Inter } from "next/font/google";
import SupabaseProvider from "./supabase-provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Nexus-Forge",
  description: "A place to forge and share your worlds.",
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
