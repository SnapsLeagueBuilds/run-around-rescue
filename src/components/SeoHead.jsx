import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function SeoHead() {
  const { data: records = [] } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
  const { data, error } = await base44.from('site_settings').select('*').eq('key', 'global');
  if (error) throw error;
  return data;
},
    staleTime: 1000 * 60 * 5,
  });

  const s = records[0];

  useEffect(() => {
    if (!s) return;

    // Title
    if (s.meta_title) document.title = s.meta_title;

    const setMeta = (name, content, prop = false) => {
      if (!content) return;
      const attr = prop ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', s.meta_description);
    setMeta('keywords', s.meta_keywords);
    setMeta('og:title', s.og_title, true);
    setMeta('og:description', s.og_description, true);
    setMeta('og:image', s.og_image_url, true);
    setMeta('google-site-verification', s.google_search_console_verification);

    // Canonical
    if (s.canonical_url) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', s.canonical_url);
    }

    // Google Analytics
    if (s.google_analytics_id) {
      if (!document.getElementById('ga-script')) {
        const script1 = document.createElement('script');
        script1.id = 'ga-script';
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${s.google_analytics_id}`;
        document.head.appendChild(script1);

        const script2 = document.createElement('script');
        script2.id = 'ga-init';
        script2.innerHTML = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${s.google_analytics_id}');`;
        document.head.appendChild(script2);
      }
    }
  }, [s]);

  return null;
}