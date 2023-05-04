import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "./lib/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Nexus-Forge",
  description: "A place to forge and share your worlds to others.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
