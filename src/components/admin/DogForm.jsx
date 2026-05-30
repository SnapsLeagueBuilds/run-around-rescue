import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';

export default function DogForm({ dog, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: dog?.name || '',
    breed: dog?.breed || '',
    age: dog?.age || '',
    gender: dog?.gender || 'Male',
    weight: dog?.weight || '',
    description: dog?.description || '',
    photo_url: dog?.photo_url || '',
    additional_photos: dog?.additional_photos || [],
    status: dog?.status || 'Available',
    memorial_note: dog?.memorial_note || '',
    spayed_neutered: dog?.spayed_neutered || false,
    vaccinated: dog?.vaccinated || false,
    good_with_kids: dog?.good_with_kids || false,
    good_with_dogs: dog?.good_with_dogs || false,
    good_with_cats: dog?.good_with_cats || false,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    if (field === 'photo_url') {
      setForm(prev => ({ ...prev, photo_url: file_url }));
    } else {
      setForm(prev => ({ ...prev, additional_photos: [...prev.additional_photos, file_url] }));
    }
    setUploading(false);
  };

  const removeAdditional = (index) => {
    setForm(prev => ({
      ...prev,
      additional_photos: prev.additional_photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-body font-medium">Name *</Label>
          <Input required value={form.name} onChange={e => set('name', e.target.value)} className="font-body" />
        </div>
        <div className="space-y-2">
          <Label className="font-body font-medium">Breed *</Label>
          <Input required value={form.breed} onChange={e => set('breed', e.target.value)} className="font-body" />
        </div>
        <div className="space-y-2">
          <Label className="font-body font-medium">Age</Label>
          <Input value={form.age} onChange={e => set('age', e.target.value)} placeholder="e.g. 2 years" className="font-body" />
        </div>
        <div className="space-y-2">
          <Label className="font-body font-medium">Gender</Label>
          <Select value={form.gender} onValueChange={v => set('gender', v)}>
            <SelectTrigger className="font-body"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="font-body font-medium">Weight</Label>
          <Input value={form.weight} onChange={e => set('weight', e.target.value)} placeholder="e.g. 45 lbs" className="font-body" />
        </div>
        <div className="space-y-2">
          <Label className="font-body font-medium">Status</Label>
          <Select value={form.status} onValueChange={v => set('status', v)}>
            <SelectTrigger className="font-body"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Adopted">Adopted</SelectItem>
              <SelectItem value="Memorial">Memorial</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="font-body font-medium">Description</Label>
        <Textarea
          value={form.description}
          onChange={e => set('description', e.target.value)}
          rows={5}
          placeholder="Personality, history, special needs..."
          className="font-body"
        />
      </div>

      {form.status === 'Memorial' && (
        <div className="space-y-2">
          <Label className="font-body font-medium">Memorial Note</Label>
          <Textarea
            value={form.memorial_note}
            onChange={e => set('memorial_note', e.target.value)}
            rows={3}
            placeholder="A loving memory or tribute to share on the memorial wall..."
            className="font-body"
          />
        </div>
      )}

      {/* Main Photo */}
      <div className="space-y-2">
        <Label className="font-body font-medium">Main Photo</Label>
        {form.photo_url ? (
          <div className="relative w-40 h-32 rounded-lg overflow-hidden border border-border">
            <img src={form.photo_url} alt="Main" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => set('photo_url', '')}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <label className="flex items-center gap-2 cursor-pointer w-fit">
            <Button type="button" variant="outline" size="sm" className="font-body gap-2" asChild>
              <span>
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Upload Photo
              </span>
            </Button>
            <input type="file" accept="image/*" className="hidden" onChange={e => handleUpload(e, 'photo_url')} />
          </label>
        )}
      </div>

      {/* Additional Photos */}
      <div className="space-y-2">
        <Label className="font-body font-medium">Additional Photos</Label>
        <div className="flex flex-wrap gap-3">
          {form.additional_photos.map((url, i) => (
            <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border">
              <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeAdditional(i)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <label className="w-24 h-24 rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
            {uploading ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : <ImageIcon className="w-5 h-5 text-muted-foreground" />}
            <input type="file" accept="image/*" className="hidden" onChange={e => handleUpload(e, 'additional')} />
          </label>
        </div>
      </div>

      {/* Toggles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          ['spayed_neutered', 'Spayed/Neutered'],
          ['vaccinated', 'Vaccinated'],
          ['good_with_kids', 'Good with Kids'],
          ['good_with_dogs', 'Good with Dogs'],
          ['good_with_cats', 'Good with Cats'],
        ].map(([key, label]) => (
          <div key={key} className="flex items-center gap-2">
            <Switch checked={form[key]} onCheckedChange={v => set(key, v)} />
            <Label className="font-body text-sm">{label}</Label>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="font-body">
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90 font-body gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {dog ? 'Update Dog' : 'Add Dog'}
        </Button>
      </div>
    </form>
  );
}