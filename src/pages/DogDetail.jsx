import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Heart, PawPrint, Check, X, Loader2 } from 'lucide-react';
import InquiryForm from '@/components/public/InquiryForm';
import { motion } from 'framer-motion';

export default function DogDetail() {
  const { id } = useParams();
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const { data: dog, isLoading } = useQuery({
    queryKey: ['dog', id],
    queryFn: async () => {
      const { data, error } = await base44.from('dogs').select('*').eq('id', id).single();
if (error) throw error;
return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!dog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <PawPrint className="w-16 h-16 text-muted-foreground/30" />
        <p className="font-body text-muted-foreground text-lg">Dog not found</p>
        <Link to="/dogs"><Button variant="outline">Back to Dogs</Button></Link>
      </div>
    );
  }

  const traits = [
    { label: 'Good with kids', value: dog.good_with_kids },
    { label: 'Good with dogs', value: dog.good_with_dogs },
    { label: 'Good with cats', value: dog.good_with_cats },
    { label: 'Spayed/Neutered', value: dog.spayed_neutered },
    { label: 'Vaccinated', value: dog.vaccinated },
  ];

  const allPhotos = [dog.photo_url, ...(dog.additional_photos || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Link to="/dogs" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to all dogs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Photos */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {allPhotos.length > 0 ? (
              <div className="space-y-3">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                  <img src={allPhotos[0]} alt={dog.name} className="w-full h-full object-cover" />
                </div>
                {allPhotos.length > 1 && (
                  <div className="grid grid-cols-3 gap-3">
                    {allPhotos.slice(1, 4).map((url, i) => (
                      <div key={i} className="aspect-square rounded-xl overflow-hidden">
                        <img src={url} alt={`${dog.name} ${i + 2}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-[4/3] rounded-2xl bg-muted flex items-center justify-center">
                <PawPrint className="w-24 h-24 text-muted-foreground/20" />
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Badge className={`font-body text-xs mb-4 ${
              dog.status === 'Available' ? 'bg-green-100 text-green-800' :
              dog.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {dog.status}
            </Badge>

            <h1 className="font-heading font-bold text-4xl md:text-5xl text-foreground">{dog.name}</h1>
            <p className="font-body text-lg text-muted-foreground mt-2">
              {dog.breed} · {dog.age} · {dog.gender}{dog.weight ? ` · ${dog.weight}` : ''}
            </p>

            {dog.description && (
              <Card className="p-5 mt-6 bg-card">
                <p className="font-body text-foreground leading-relaxed whitespace-pre-line">{dog.description}</p>
              </Card>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
              {traits.map(t => (
                <div key={t.label} className="flex items-center gap-2 font-body text-sm">
                  {t.value ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-muted-foreground/40" />
                  )}
                  <span className={t.value ? 'text-foreground' : 'text-muted-foreground/60'}>{t.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-3">
              <Dialog open={inquiryOpen} onOpenChange={setInquiryOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="w-full bg-primary hover:bg-primary/90 font-body gap-2 text-base">
                    <Heart className="w-5 h-5" /> Inquire About {dog.name}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="font-heading text-xl">
                      Adoption Inquiry — {dog.name}
                    </DialogTitle>
                  </DialogHeader>
                  <InquiryForm
                    dogName={dog.name}
                    dogId={dog.id}
                    onSuccess={() => setTimeout(() => setInquiryOpen(false), 2000)}
                  />
                </DialogContent>
              </Dialog>

              <Link to="/contact" className="block">
                <Button variant="outline" size="lg" className="w-full font-body text-base">
                  General Questions? Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}