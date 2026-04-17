import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PAGE_SEO, SITE_DESCRIPTION, SITE_IMAGE, SITE_NAME, SITE_URL } from '../lib/seo';

const ensureMeta = (key: 'name' | 'property', value: string): HTMLMetaElement => {
  const selector = `meta[${key}="${value}"]`;
  const existing = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (existing) return existing;

  const el = document.createElement('meta');
  el.setAttribute(key, value);
  document.head.appendChild(el);
  return el;
};

const ensureCanonical = (): HTMLLinkElement => {
  const existing = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (existing) return existing;

  const link = document.createElement('link');
  link.rel = 'canonical';
  document.head.appendChild(link);
  return link;
};

export const SeoManager: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const page = PAGE_SEO[location.pathname];
    const title = page?.title || SITE_NAME;
    const description = page?.description || SITE_DESCRIPTION;
    const canonicalPath = location.pathname === '/' ? '/dashboard' : location.pathname;
    const canonicalUrl = `${SITE_URL}/#${canonicalPath}`;

    document.title = title;
    ensureCanonical().href = canonicalUrl;

    ensureMeta('name', 'description').content = description;
    ensureMeta('name', 'robots').content = page?.noindex ? 'noindex, nofollow' : 'index, follow';

    ensureMeta('property', 'og:type').content = 'website';
    ensureMeta('property', 'og:site_name').content = SITE_NAME;
    ensureMeta('property', 'og:title').content = title;
    ensureMeta('property', 'og:description').content = description;
    ensureMeta('property', 'og:url').content = canonicalUrl;
    ensureMeta('property', 'og:image').content = SITE_IMAGE;

    ensureMeta('name', 'twitter:card').content = 'summary_large_image';
    ensureMeta('name', 'twitter:title').content = title;
    ensureMeta('name', 'twitter:description').content = description;
    ensureMeta('name', 'twitter:image').content = SITE_IMAGE;
  }, [location.pathname]);

  return null;
};
