"use client";
import Providers from "./providers";
import Sidebar from "@/components/Sidebar/Sidebar";

export default function RootLayout({ children }) {
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
