import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function Events() {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
  const { data, error } = await base44.from('events').select('*').order('date', { ascending: true });
  if (error) throw error;
  return data;
},
  });

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-16 md:py-24 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Calendar className="w-10 h-10 text-primary-foreground mx-auto mb-4" />
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-primary-foreground">
            Upcoming Events
          </h1>
          <p className="font-body text-primary-foreground/80 mt-3 text-lg max-w-xl mx-auto">
            Join us for adoption events, community gatherings, and volunteer opportunities!
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading font-semibold text-lg text-foreground">No upcoming events</h3>
            <p className="font-body text-muted-foreground mt-2">
              Check back soon for exciting events and opportunities to get involved!
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="font-heading text-2xl text-foreground">
                          {event.title}
                        </CardTitle>
                        {event.description && (
                          <CardDescription className="mt-1">{event.description}</CardDescription>
                        )}
                      </div>
                      <Badge className="bg-primary text-primary-foreground">
                        {event.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-body text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4 text-primary" />
                        <div>
                          <p className="font-medium text-foreground">
                            {event.date ? format(new Date(event.date), 'MMMM d, yyyy') : '—'}
                          </p>
                          {event.time && <p>{event.time}</p>}
                        </div>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4 text-primary" />
                          <p className="font-medium text-foreground">{event.location}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}