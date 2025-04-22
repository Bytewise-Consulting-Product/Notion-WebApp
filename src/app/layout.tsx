import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import ProvidersRedux from "@/store/providers";

export const metadata: Metadata = {
  title: "Notion Web App",
  description: "Create, Collaborate, and Stay Productive",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ProvidersRedux>{children}</ProvidersRedux>
        </body>
      </html>
    </ClerkProvider>
  );
}
