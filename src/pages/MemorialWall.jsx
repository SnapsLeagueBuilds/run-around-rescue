import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { Heart, PawPrint, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MemorialWall() {
  const { data: dogs = [], isLoading } = useQuery({
    queryKey: ['memorial-dogs'],
    queryFn: async () => {
  const { data, error } = await base44.from('dogs').select('*').eq('status', 'Memorial').order('created_date', { ascending: false });
  if (error) throw error;
  return data;
},
  });

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-accent py-16 md:py-24 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-10 h-10 text-primary mx-auto mb-4" />
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-primary-foreground">
            In Loving Memory
          </h1>
          <p className="font-body text-primary-foreground/70 mt-3 text-lg max-w-xl mx-auto">
            Forever in our hearts. These beloved souls touched our lives and reminded us why we do this work.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : dogs.length === 0 ? (
          <div className="text-center py-16">
            <PawPrint className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-heading font-semibold text-lg text-foreground">No memorials yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dogs.map((dog, index) => (
              <motion.div
                key={dog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Card className="overflow-hidden border-2 border-border/50 bg-card/80 hover:shadow-lg transition-shadow">
                  <div className="aspect-square overflow-hidden relative">
                    {dog.photo_url ? (
                      <img
                        src={dog.photo_url}
                        alt={dog.name}
                        className="w-full h-full object-cover grayscale"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <PawPrint className="w-16 h-16 text-muted-foreground/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <h3 className="font-heading font-bold text-xl text-white">{dog.name}</h3>
                      <p className="font-body text-sm text-white/80">{dog.breed}{dog.age ? ` · ${dog.age}` : ''}</p>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Heart className="w-6 h-6 text-white/80 fill-white/50" />
                    </div>
                  </div>
                  {dog.memorial_note && (
                    <CardContent className="pt-4 pb-4">
                      <p className="font-body text-sm text-muted-foreground italic leading-relaxed">
                        "{dog.memorial_note}"
                      </p>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <p className="font-body text-muted-foreground text-sm italic">
            Run around free, little ones. 🐾
          </p>
        </div>
      </div>
    </div>
  );
}