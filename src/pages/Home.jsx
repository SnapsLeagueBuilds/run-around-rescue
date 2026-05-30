import React from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Heart, PawPrint, Shield, Stethoscope, Truck, Scissors } from 'lucide-react';
import { motion } from 'framer-motion';
import DogCard from '@/components/public/DogCard';

const HERO_IMAGE = 'https://media.base44.com/images/public/6a188e230d38c507c8f0ca4a/c5478562d_generated_ae12b67a.png';

const services = [
  { icon: PawPrint, title: 'Rescue & Rehabilitation', desc: 'We save dogs from dangerous and neglectful situations.' },
  { icon: Stethoscope, title: 'Veterinary Care', desc: 'Full medical care, vaccinations, and medications.' },
  { icon: Shield, title: 'Food, Shelter & Daily Care', desc: 'Safe housing and proper nutrition for every dog.' },
  { icon: Scissors, title: 'Spay & Neuter', desc: 'Responsible population control assistance.' },
  { icon: Truck, title: 'Transport', desc: 'Transportation for dogs in need across the region.' },
  { icon: Heart, title: 'Forever Homes', desc: 'Matching dogs with loving, permanent families.' },
];

export default function Home() {
  const { data: dogs = [] } = useQuery({
    queryKey: ['dogs-featured'],
    queryFn: async () => {
  const { data, error } = await base44.from('dogs').select('*').eq('status', 'Available').order('created_date', { ascending: false }).limit(6);
  if (error) throw error;
  return data;
},
  });

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Rescue dogs" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-accent/90 via-accent/70 to-accent/40" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="font-body text-sm uppercase tracking-[0.2em] text-primary mb-4 font-medium">
                A Cause Worth Barking About
              </p>
              <h1 className="font-heading font-black text-5xl md:text-7xl text-primary-foreground leading-[1.05]">
                Rescue a Dog.<br />
                <span className="text-primary">Change a Life.</span>
              </h1>
              <p className="font-body text-lg text-primary-foreground/70 mt-6 leading-relaxed max-w-lg">
                We are a 501(c)(3) nonprofit dedicated to rescuing, rehabilitating, and rehoming
                abandoned and at-risk dogs across Northern New Mexico.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link to="/dogs">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 font-body gap-2 text-base px-8">
                    <PawPrint className="w-5 h-5" /> Meet Our Dogs
                  </Button>
                </Link>
                <Link to="/donate">
                  <Button size="lg" variant="outline" className="font-body gap-2 text-base px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                    <Heart className="w-5 h-5" /> Donate
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <p className="font-body text-sm uppercase tracking-[0.2em] text-primary font-medium mb-3">
              A Cause for Healing Paws
            </p>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
              Every Dog Deserves Love. Every Heart Can Help.
            </h2>
            <p className="font-body text-muted-foreground mt-4 leading-relaxed">
              Based in Costilla, NM, Run Around Dog Town Rescue provides a safe haven for dogs in need.
              Your support helps us provide essential care and find forever homes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc, i) => (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <svc.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground">{svc.title}</h3>
                <p className="font-body text-sm text-muted-foreground mt-2 leading-relaxed">{svc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Dogs */}
      {dogs.length > 0 && (
        <section className="py-20 md:py-28 bg-secondary/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="font-body text-sm uppercase tracking-[0.2em] text-primary font-medium mb-3">
                Find Your New Best Friend
              </p>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
                Dogs Available for Adoption
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {dogs.map((dog, i) => (
                <DogCard key={dog.id} dog={dog} index={i} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/dogs">
                <Button variant="outline" size="lg" className="font-body gap-2">
                  <PawPrint className="w-5 h-5" /> View All Dogs
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 md:py-28 bg-accent text-accent-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Heart className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary-foreground">
              Together, We Can Heal Paws & Heal Hearts
            </h2>
            <p className="font-body text-primary-foreground/60 mt-4 text-lg leading-relaxed max-w-2xl mx-auto">
              Your donation helps us continue saving lives and giving dogs the second chance they deserve.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link to="/donate">
                <Button size="lg" className="bg-primary hover:bg-primary/90 font-body gap-2 text-base px-8">
                  <Heart className="w-5 h-5" /> Donate Now
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="font-body text-base px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Get In Touch
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}