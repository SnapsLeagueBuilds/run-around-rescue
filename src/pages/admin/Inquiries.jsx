import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Mail, Phone, PawPrint, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const statusColors = {
  New: 'bg-blue-100 text-blue-800',
  Reviewed: 'bg-yellow-100 text-yellow-800',
  Contacted: 'bg-green-100 text-green-800',
  Closed: 'bg-muted text-muted-foreground',
};

export default function Inquiries() {
  const queryClient = useQueryClient();

  const { data: inquiries = [], isLoading } = useQuery({
    queryKey: ['admin-inquiries'],
    queryFn: async () => {
      const { data, error } = await base44
        .from('adoption_inquiries')
        .select('*')
        .order('created_date', { ascending: false })
        .limit(200);
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const { error } = await base44
        .from('adoption_inquiries')
        .update(data)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] }),
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading font-bold text-2xl md:text-3xl text-foreground">Adoption Inquiries</h1>
        <p className="font-body text-muted-foreground mt-1">Review and manage incoming inquiries.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : inquiries.length === 0 ? (
        <Card className="p-12 text-center">
          <MessageSquare className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <p className="font-body text-muted-foreground text-lg">No inquiries yet</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {inquiries.map(inq => (
            <Card key={inq.id} className="p-5 bg-card">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-heading font-semibold text-lg text-foreground">{inq.full_name}</h3>
                    <Badge className={`${statusColors[inq.status] || ''} font-body text-xs`}>{inq.status}</Badge>
                  </div>
                  {inq.dog_name && (
                    <div className="flex items-center gap-2 font-body text-sm text-muted-foreground">
                      <PawPrint className="w-4 h-4 text-primary" />
                      <span>Inquiring about: <strong className="text-foreground">{inq.dog_name}</strong></span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-4 font-body text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {inq.email}</span>
                    {inq.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {inq.phone}</span>}
                  </div>
                  {inq.message && (
                    <p className="font-body text-sm text-foreground mt-2 bg-muted/50 p-3 rounded-lg">{inq.message}</p>
                  )}
                  <p className="font-body text-xs text-muted-foreground">
                    {inq.created_date ? format(new Date(inq.created_date), 'MMM d, yyyy · h:mm a') : ''}
                  </p>
                </div>
                <div className="flex-shrink-0 w-36">
                  <Select
                    value={inq.status}
                    onValueChange={v => updateMutation.mutate({ id: inq.id, data: { status: v } })}
                  >
                    <SelectTrigger className="font-body text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Reviewed">Reviewed</SelectItem>
                      <SelectItem value="Contacted">Contacted</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}