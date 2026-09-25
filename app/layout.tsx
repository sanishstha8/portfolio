import type { Metadata, Viewport } from "next";
import { Poppins, Inter, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";

import { site } from "@/lib/site";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { StartAtTop } from "@/components/layout/StartAtTop";
import { GridBackdrop } from "@/components/ui/GridBackdrop";
import { Cursor } from "@/components/ui/Cursor";
import { FaqWidget } from "@/components/faq/FaqWidget";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const title = "Sanish Shrestha · Python & Django Developer";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: "%s · Sanish Shrestha",
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.githubUrl }],
  creator: site.name,
  keywords: [
    "Sanish Shrestha",
    "Python developer",
    "Django developer",
    "backend developer",
    "REST API",
    "Nepal",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

/** Structured data — only facts stated on the page itself. */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  url: site.url,
  email: `mailto:${site.email}`,
  sameAs: [site.githubUrl, site.linkedinUrl],
  address: {
    "@type": "PostalAddress",
    addressCountry: "NP",
  },
  knowsAbout: [
    "Python",
    "Django",
    "Django REST Framework",
    "REST APIs",
    "PostgreSQL",
    "Backend development",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} ${jetBrainsMono.variable}`}
    >
      <body className="min-h-dvh antialiased">
        <script
          type="application/ld+json"
          // Static, author-controlled object — no user input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <MotionProvider>
          <StartAtTop />
          <GridBackdrop />
          <Cursor />
          <Navigation />
          <div className="relative z-10 flex min-h-dvh flex-col">
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <FaqWidget />
        </MotionProvider>
      </body>
    </html>
  );
}
