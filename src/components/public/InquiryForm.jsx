import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, CheckCircle2, Loader2 } from 'lucide-react';

export default function InquiryForm({ dogName, dogId, onSuccess }) {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setSending(true);
    setError('');

    try {
      const { error } = await base44
        .from('adoption_inquiries')
        .insert([{
          ...form,
          dog_name: dogName || 'General Inquiry',
          dog_id: dogId || '',
          status: 'New',
        }]);

      if (error) throw error;

      setSent(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center py-8 space-y-3">
        <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
        <h3 className="font-heading font-bold text-xl">Thank You!</h3>
        <p className="font-body text-muted-foreground">
          We've received your inquiry and will get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-body font-medium">Full Name *</Label>
          <Input
            required
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            placeholder="Your name"
            className="font-body"
          />
        </div>
        <div className="space-y-2">
          <Label className="font-body font-medium">Email *</Label>
          <Input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="your@email.com"
            className="font-body"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="font-body font-medium">Phone</Label>
        <Input
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="(555) 123-4567"
          className="font-body"
        />
      </div>
      <div className="space-y-2">
        <Label className="font-body font-medium">Message</Label>
        <Textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Tell us about yourself and why you'd like to adopt..."
          rows={4}
          className="font-body"
        />
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-body">
          {error}
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={sending}
        className="w-full bg-primary hover:bg-primary/90 font-body gap-2"
      >
        {sending ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
        ) : (
          <><Send className="w-4 h-4" /> Send Inquiry</>
        )}
      </Button>
    </div>
  );
}