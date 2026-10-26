"use client";

import Script from "next/script";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-MDD2QQZP4L";
  const { user, isLoaded } = useUser();

  // Khi user đăng nhập, gửi user_id sang GA4 để đo số phút và tương tác theo từng user
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.gtag === "function" && isLoaded && user?.id && gaId) {
      window.gtag("config", gaId, {
        user_id: user.id,
        user_properties: {
          email: user.primaryEmailAddress?.emailAddress || "unknown",
          full_name: user.fullName || "User",
        },
      });
    }
  }, [user, isLoaded, gaId]);

  if (!gaId) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              send_page_view: true
            });
          `,
        }}
      />
    </>
  );
}
