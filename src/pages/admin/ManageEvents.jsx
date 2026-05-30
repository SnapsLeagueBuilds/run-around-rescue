import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Calendar, MapPin, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const EVENT_TYPES = ['Adoption Event', 'Community Event', 'Volunteer', 'Fundraiser', 'Other'];
const emptyForm = { title: '', date: '', time: '', location: '', description: '', type: 'Community Event' };

function EventForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial || emptyForm);
  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="font-body">Title *</Label>
        <Input required value={form.title} onChange={e => set('title', e.target.value)} placeholder="Event title" className="font-body" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-body">Date *</Label>
          <Input required type="date" value={form.date} onChange={e => set('date', e.target.value)} className="font-body" />
        </div>
        <div className="space-y-2">
          <Label className="font-body">Time</Label>
          <Input value={form.time} onChange={e => set('time', e.target.value)} placeholder="10:00 AM - 4:00 PM" className="font-body" />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="font-body">Location</Label>
        <Input value={form.location} onChange={e => set('location', e.target.value)} placeholder="Taos Plaza, Taos, NM" className="font-body" />
      </div>
      <div className="space-y-2">
        <Label className="font-body">Type</Label>
        <Select value={form.type} onValueChange={val => set('type', val)}>
          <SelectTrigger className="font-body"><SelectValue /></SelectTrigger>
          <SelectContent>
            {EVENT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="font-body">Description</Label>
        <Textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe the event..." rows={3} className="font-body" />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="font-body">Cancel</Button>
        <Button onClick={() => onSave(form)} disabled={saving} className="bg-primary hover:bg-primary/90 font-body gap-2">
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save Event'}
        </Button>
      </div>
    </div>
  );
}

export default function ManageEvents() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await base44
        .from('events')
        .select('*')
        .order('date', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const { error } = await base44
        .from('events')
        .insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const { error } = await base44
        .from('events')
        .update(data)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await base44
        .from('events')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setDeletingId(null);
    },
  });

  const saving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground">Events</h1>
          <p className="font-body text-muted-foreground mt-1">Manage public-facing events.</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90 font-body gap-2">
          <Plus className="w-4 h-4" /> Add Event
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : events.length === 0 ? (
        <Card className="py-16 text-center">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-heading font-semibold text-foreground">No events yet</p>
          <p className="font-body text-muted-foreground text-sm mt-1">Click "Add Event" to create your first event.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {events.map(event => (
            <Card key={event.id} className="overflow-hidden">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-heading font-bold text-lg text-foreground">{event.title}</h3>
                      <Badge className="bg-primary/10 text-primary border-primary/20 font-body text-xs">{event.type}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2 font-body text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {event.date ? format(new Date(event.date), 'MMMM d, yyyy') : '—'}
                        {event.time && ` · ${event.time}`}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-primary" /> {event.location}
                        </span>
                      )}
                    </div>
                    {event.description && (
                      <p className="font-body text-sm text-muted-foreground mt-2 line-clamp-2">{event.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="icon" variant="ghost" onClick={() => setEditing(event)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeletingId(event.id)}
                      disabled={deleteMutation.isPending && deletingId === event.id}
                    >
                      {deleteMutation.isPending && deletingId === event.id
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Trash2 className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">Add New Event</DialogTitle>
          </DialogHeader>
          <EventForm onSave={(data) => createMutation.mutate(data)} onCancel={() => setShowForm(false)} saving={saving} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => { if (!o) setEditing(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">Edit Event</DialogTitle>
          </DialogHeader>
          {editing && (
            <EventForm
              initial={editing}
              onSave={(data) => updateMutation.mutate({ id: editing.id, data })}
              onCancel={() => setEditing(null)}
              saving={saving}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deletingId} onOpenChange={(o) => { if (!o) setDeletingId(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-heading">Delete Event?</DialogTitle>
          </DialogHeader>
          <p className="font-body text-muted-foreground text-sm">This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeletingId(null)} className="font-body">Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate(deletingId)}
              disabled={deleteMutation.isPending}
              className="font-body gap-2"
            >
              {deleteMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</> : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}