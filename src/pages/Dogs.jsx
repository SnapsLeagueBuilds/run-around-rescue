import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PawPrint, Loader2 } from 'lucide-react';
import DogCard from '@/components/public/DogCard';

export default function Dogs() {
  const [filter, setFilter] = useState('Available');

  const { data: dogs = [], isLoading } = useQuery({
    queryKey: ['dogs-public'],
    queryFn: async () => {
  const { data, error } = await base44.from('dogs').select('*').order('created_date', { ascending: false }).limit(100);
  if (error) throw error;
  return data;
},
  });

  const filtered = filter === 'All' ? dogs : dogs.filter(d => d.status === filter);

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-accent py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <PawPrint className="w-10 h-10 text-primary mx-auto mb-4" />
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-primary-foreground">
            Adoptable Dogs
          </h1>
          <p className="font-body text-primary-foreground/60 mt-3 text-lg max-w-xl mx-auto">
            Meet our amazing dogs looking for their forever homes.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center mb-10">
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="font-body">
              <TabsTrigger value="Available">Available</TabsTrigger>
              <TabsTrigger value="Pending">Pending</TabsTrigger>
              <TabsTrigger value="Adopted">Adopted</TabsTrigger>
              <TabsTrigger value="All">All</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <PawPrint className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-body text-muted-foreground text-lg">No dogs found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((dog, i) => (
              <DogCard key={dog.id} dog={dog} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}