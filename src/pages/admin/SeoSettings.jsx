import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Save, Search, BarChart3, Globe, CheckCircle2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const SETTINGS_KEY = 'global';

export default function SeoSettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState({
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    og_title: '',
    og_description: '',
    og_image_url: '',
    google_analytics_id: '',
    google_search_console_verification: '',
    canonical_url: '',
  });

  const { data: records = [], isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await base44
        .from('site_settings')
        .select('*')
        .eq('key', SETTINGS_KEY);
      if (error) throw error;
      return data;
    },
  });

  const existing = records[0] || null;

  useEffect(() => {
    if (existing) {
      setForm({
        meta_title: existing.meta_title || '',
        meta_description: existing.meta_description || '',
        meta_keywords: existing.meta_keywords || '',
        og_title: existing.og_title || '',
        og_description: existing.og_description || '',
        og_image_url: existing.og_image_url || '',
        google_analytics_id: existing.google_analytics_id || '',
        google_search_console_verification: existing.google_search_console_verification || '',
        canonical_url: existing.canonical_url || '',
      });
    }
  }, [existing?.id]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (existing) {
        const { error } = await base44
          .from('site_settings')
          .update(data)
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await base44
          .from('site_settings')
          .insert([{ key: SETTINGS_KEY, ...data }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast({ title: 'Settings saved!', description: 'Your SEO settings have been updated.' });
    },
  });

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  if (isLoading) {
    return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading font-bold text-3xl text-foreground">SEO & Analytics</h1>
        <p className="font-body text-muted-foreground mt-1">Manage site metadata, social sharing, and analytics integrations.</p>
      </div>

      <div className="space-y-6">
        {/* Meta Tags */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              <CardTitle className="font-heading text-xl">Search Engine Optimization</CardTitle>
            </div>
            <CardDescription className="font-body">Control how your site appears in search results.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="font-body">Page Title</Label>
              <Input
                value={form.meta_title}
                onChange={e => set('meta_title', e.target.value)}
                placeholder="Run Around Dog Town Rescue | Taos, NM"
                className="font-body"
              />
              <p className="text-xs text-muted-foreground font-body">Recommended: 50–60 characters. Currently: {form.meta_title.length}</p>
            </div>
            <div className="space-y-2">
              <Label className="font-body">Meta Description</Label>
              <Textarea
                value={form.meta_description}
                onChange={e => set('meta_description', e.target.value)}
                placeholder="We rescue, rehabilitate, and rehome dogs in Northern New Mexico..."
                rows={3}
                className="font-body"
              />
              <p className="text-xs text-muted-foreground font-body">Recommended: 150–160 characters. Currently: {form.meta_description.length}</p>
            </div>
            <div className="space-y-2">
              <Label className="font-body">Keywords</Label>
              <Input
                value={form.meta_keywords}
                onChange={e => set('meta_keywords', e.target.value)}
                placeholder="dog rescue, Taos NM, adopt a dog, puppy adoption"
                className="font-body"
              />
              <p className="text-xs text-muted-foreground font-body">Comma-separated keywords.</p>
            </div>
            <div className="space-y-2">
              <Label className="font-body">Canonical URL</Label>
              <Input
                value={form.canonical_url}
                onChange={e => set('canonical_url', e.target.value)}
                placeholder="https://www.yourdomain.com"
                className="font-body"
              />
            </div>
          </CardContent>
        </Card>

        {/* Open Graph / Social */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              <CardTitle className="font-heading text-xl">Social Sharing (Open Graph)</CardTitle>
            </div>
            <CardDescription className="font-body">Customize how links appear when shared on Facebook, Twitter, etc.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="font-body">OG Title</Label>
              <Input
                value={form.og_title}
                onChange={e => set('og_title', e.target.value)}
                placeholder="Run Around Dog Town Rescue"
                className="font-body"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-body">OG Description</Label>
              <Textarea
                value={form.og_description}
                onChange={e => set('og_description', e.target.value)}
                placeholder="Saving lives, one paw at a time."
                rows={2}
                className="font-body"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-body">OG Image URL</Label>
              <Input
                value={form.og_image_url}
                onChange={e => set('og_image_url', e.target.value)}
                placeholder="https://yourdomain.com/og-image.jpg"
                className="font-body"
              />
              <p className="text-xs text-muted-foreground font-body">Recommended size: 1200×630px.</p>
            </div>
          </CardContent>
        </Card>

        {/* Google Analytics */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <CardTitle className="font-heading text-xl">Google Analytics</CardTitle>
            </div>
            <CardDescription className="font-body">
              Track visitors and behavior via Google Analytics 4.{' '}
              <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                Get your Measurement ID →
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="font-body">Measurement ID</Label>
              <Input
                value={form.google_analytics_id}
                onChange={e => set('google_analytics_id', e.target.value)}
                placeholder="G-XXXXXXXXXX"
                className="font-body font-mono"
              />
            </div>
            {form.google_analytics_id && (
              <div className="flex items-center gap-2 text-sm text-green-600 font-body bg-green-50 rounded-lg p-3">
                <CheckCircle2 className="w-4 h-4" />
                GA4 snippet will be injected into the site &lt;head&gt; automatically.
              </div>
            )}
            <div className="bg-muted rounded-lg p-4 text-sm font-body text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">How to set up:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Go to <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Analytics</a> and create a GA4 property.</li>
                <li>Copy your Measurement ID (starts with G-).</li>
                <li>Paste it above and save.</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Google Search Console */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              <CardTitle className="font-heading text-xl">Google Search Console</CardTitle>
            </div>
            <CardDescription className="font-body">
              Verify site ownership for Search Console.{' '}
              <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                Open Search Console →
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="font-body">Verification Meta Content</Label>
              <Input
                value={form.google_search_console_verification}
                onChange={e => set('google_search_console_verification', e.target.value)}
                placeholder="abc123xyz..."
                className="font-body font-mono"
              />
              <p className="text-xs text-muted-foreground font-body">
                Only paste the <strong>content</strong> value from the meta tag Google provides — not the full tag.
                e.g. from <code className="bg-muted px-1 rounded">{'<meta name="google-site-verification" content="abc123">'}</code> enter <code className="bg-muted px-1 rounded">abc123</code>
              </p>
            </div>
            <div className="bg-muted rounded-lg p-4 text-sm font-body text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">How to verify:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Go to <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Search Console</a> and add your property.</li>
                <li>Choose "HTML tag" verification method.</li>
                <li>Copy only the <strong>content</strong> value and paste above.</li>
                <li>Save settings, then click Verify in Search Console.</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pb-8">
          <Button
            onClick={() => saveMutation.mutate(form)}
            disabled={saveMutation.isPending}
            className="bg-primary hover:bg-primary/90 font-body gap-2 px-8"
          >
            {saveMutation.isPending
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              : <><Save className="w-4 h-4" /> Save Settings</>}
          </Button>
        </div>
      </div>
    </div>
  );
}