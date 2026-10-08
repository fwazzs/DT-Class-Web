// Guards for links built from content in src/data/site.ts.

const EMAIL = /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/;

/** In-page anchors, site paths, or https URLs only. Anything else (javascript:, data:, http:) returns null. */
export function safeHref(href: string | null | undefined): string | null {
  if (!href) return null;
  const v = href.trim();
  if (v.startsWith('#') || (v.startsWith('/') && !v.startsWith('//'))) return v;
  try {
    return new URL(v).protocol === 'https:' ? v : null;
  } catch {
    return null;
  }
}

export function isExternal(href: string): boolean {
  return href.startsWith('https:');
}

/** A plain address, so `mailto:` can't carry injected ?cc= / &bcc= / ?body= parameters. */
export function safeEmail(email: string | null | undefined): string | null {
  const v = email?.trim();
  return v && EMAIL.test(v) ? v : null;
}
