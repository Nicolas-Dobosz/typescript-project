'use client';

import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import NavBar from "@/app/components/NavBar";
import {usePathname} from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideNavBar = pathname === '/login' || pathname === '/register' || pathname === '/logout';

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex flex-row w-screen h-screen">
            {!hideNavBar && <NavBar />}

            <div className={hideNavBar ? "w-full" : "ml-[5vw] w-[95vw]"}>
                {children}
            </div>
        </div>

      </body>
    </html>
  );
}
