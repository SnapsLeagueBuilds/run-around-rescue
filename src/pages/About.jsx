import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Heart, PawPrint, Shield, Users, Home as HomeIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const values = [
  { icon: Heart, title: 'Compassion', desc: 'Every dog that enters our care is treated with love, patience, and kindness.' },
  { icon: Shield, title: 'Responsibility', desc: 'We ensure every dog is healthy, spayed/neutered, and ready for their forever home.' },
  { icon: Users, title: 'Community', desc: 'We work with local communities to educate and promote responsible pet ownership.' },
  { icon: HomeIcon, title: 'Forever Homes', desc: 'We carefully match dogs with families to ensure a lasting, loving bond.' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-accent py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <PawPrint className="w-10 h-10 text-primary mx-auto mb-4" />
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-primary-foreground">
            About Our Mission
          </h1>
          <p className="font-body text-primary-foreground/60 mt-3 text-lg max-w-xl mx-auto">
            A cause for healing paws since day one.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-lg max-w-none"
          >
            <div className="font-body text-foreground leading-relaxed space-y-5 text-base">
              <p>
                <strong className="font-heading text-xl">Run Around Dog Town Rescue</strong> is a 501(c)(3) nonprofit
                program of Charles Cisneros Post 16, dedicated to rescuing, rehabilitating, and rehoming abandoned,
                neglected, and at-risk dogs across Northern New Mexico.
              </p>
              <p>
                Based in Costilla, NM, we believe that every dog deserves a chance at a safe, loving life.
                Our volunteers work tirelessly to rescue dogs from dangerous situations, provide them with
                necessary medical care, and prepare them for adoption into carefully screened forever homes.
              </p>
              <p>
                Your support — whether through adoption, fostering, volunteering, or donations — directly
                impacts the lives of dogs in our community. Together, we can heal paws and heal hearts.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading font-bold text-3xl text-foreground text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 bg-card rounded-xl border border-border"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground">{v.title}</h3>
                <p className="font-body text-sm text-muted-foreground mt-2">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-heading font-bold text-3xl text-foreground mb-4">Ready to Make a Difference?</h2>
          <p className="font-body text-muted-foreground text-lg mb-8">
            Whether you adopt, donate, or volunteer — you're saving a life.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/dogs">
              <Button size="lg" className="bg-primary hover:bg-primary/90 font-body gap-2">
                <PawPrint className="w-5 h-5" /> Meet Our Dogs
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="font-body">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}