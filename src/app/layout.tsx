import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Calculadoras Financieras para Freelancers",
  description:
    "Calculadoras de precio, punto de equilibrio y análisis competitivo con precisión y consejos inteligentes.",
  openGraph: {
    title: "Calculadoras Financieras",
    description:
      "Decisiones de precio basadas en datos. Calculadoras de Precio Ideal y Punto de Equilibrio.",
    type: "website",
    url: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedMode = localStorage.getItem('darkMode');
                  if (savedMode === 'true') {
                    document.documentElement.classList.add('dark');
                  } else {
                    // Si no hay preferencia o es false, asegurar modo claro
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  // En caso de error, default a modo claro
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
