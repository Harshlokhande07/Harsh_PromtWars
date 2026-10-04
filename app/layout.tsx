import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Blind Sport — AI Thinking Partner for Tough Decisions",
  description:
    "An AI thinking partner that surfaces unstated assumptions, overlooked factors, cognitive biases, and sharp socratic questions. Never gives a verdict.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-bg text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
