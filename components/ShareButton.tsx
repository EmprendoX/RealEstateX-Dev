"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

interface ShareButtonProps {
  /** Title of the thing being shared (e.g. the property title). */
  title: string;
  /** Optional explicit URL. Defaults to the current page URL. */
  url?: string;
}

/**
 * Simple, bilingual share widget.
 * - "Copy link" copies the URL to the clipboard with visual feedback.
 * - "WhatsApp" opens WhatsApp with the link prefilled to send to anyone.
 * - On devices that support it, a native "Share" button opens the OS share sheet.
 *
 * The shared link unfurls with title, description and image thanks to the
 * Open Graph / Twitter meta tags rendered by the Layout component.
 */
export default function ShareButton({ title, url }: ShareButtonProps) {
  const { t } = useTranslation("common");
  const [shareUrl, setShareUrl] = useState(url || "");
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    // Resolve the URL on the client so it includes the current locale prefix.
    if (!url && typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
    if (typeof navigator !== "undefined" && "share" in navigator) {
      setCanNativeShare(true);
    }
  }, [url]);

  const shareText = `${title} — ${shareUrl}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && shareUrl) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback for older browsers
        const input = document.createElement("input");
        input.value = shareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // no-op
    }
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title, text: title, url: shareUrl });
    } catch {
      // user cancelled or not supported — ignore
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-6">
      <div className="mb-3">
        <h3 className="font-bold text-gray-900">{t("propertyDetail.shareTitle")}</h3>
        <p className="text-sm text-gray-600">{t("propertyDetail.shareSubtitle")}</p>
      </div>

      {/* Link + copy */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          readOnly
          value={shareUrl}
          onFocus={(e) => e.target.select()}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm truncate focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <button
          type="button"
          onClick={handleCopy}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
            copied
              ? "bg-green-500 text-white"
              : "bg-primary hover:bg-primary/90 text-white"
          }`}
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t("propertyDetail.copied")}
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {t("propertyDetail.copyLink")}
            </>
          )}
        </button>
      </div>

      {/* Quick share buttons */}
      <div className="flex flex-wrap gap-2 mt-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          {t("propertyDetail.shareWhatsapp")}
        </a>
        {canNativeShare && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {t("propertyDetail.shareMore")}
          </button>
        )}
      </div>
    </div>
  );
}
