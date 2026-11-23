import { Providers } from "@/components/providers";
import { getStoreSettings } from "lib/storefront/settings";
import { baseUrl } from "lib/utils";
import { Inter, Playfair_Display } from "next/font/google";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";

export const dynamic = "force-dynamic";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata() {
  try {
    const settings = await getStoreSettings();
    const title = settings.metaTitle || settings.storeName || "My Blog";
    const description = settings.metaDescription || "Articles, guides and updates.";
    return {
      metadataBase: new URL(baseUrl),
      title: {
        default: title,
        template: `%s | ${title}`,
      },
      description,
      icons: settings.faviconUrl ? { icon: settings.faviconUrl } : undefined,
      robots: {
        follow: true,
        index: true,
        googleBot: {
          follow: true,
          index: true,
        },
      },
      alternates: {
        canonical: baseUrl,
      },
      verification: settings.googleSiteVerification
        ? { google: settings.googleSiteVerification }
        : undefined,
      openGraph: {
        type: "website",
        siteName: title,
        title: {
          default: title,
          template: `%s | ${title}`,
        },
        description,
        url: baseUrl,
      },
      twitter: {
        card: "summary_large_image",
        title: {
          default: title,
          template: `%s | ${title}`,
        },
        description,
      },
    };
  } catch {
    return {
      metadataBase: new URL(baseUrl),
      title: {
        default: "My Blog",
        template: "%s | My Blog",
      },
      description: "Articles, guides and updates.",
      robots: {
        follow: true,
        index: true,
      },
    };
  }
}

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="bg-white text-neutral-900 antialiased selection:bg-neutral-200">
        <Providers>
          {children}
          <Toaster closeButton />
        </Providers>
      </body>
    </html>
  );
}
