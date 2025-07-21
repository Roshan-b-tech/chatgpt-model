"use client";
import React, { ReactNode } from "react";
import Providers from "./providers";
import Sidebar from "@/components/Sidebar/Sidebar";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Sidebar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
