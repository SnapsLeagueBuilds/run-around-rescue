import React from 'react';
import { Card } from "@/components/ui/card";
import { Heart, PawPrint, Stethoscope, Shield, Truck, Scissors } from 'lucide-react';
import { motion } from 'framer-motion';

const impacts = [
  { icon: PawPrint, title: 'Rescue & Rehabilitation', desc: 'Saving dogs from dangerous situations' },
  { icon: Stethoscope, title: 'Veterinary Care', desc: 'Vaccinations, medications, and treatment' },
  { icon: Shield, title: 'Food & Shelter', desc: 'Safe housing and proper nutrition' },
  { icon: Scissors, title: 'Spay & Neuter', desc: 'Responsible population control' },
  { icon: Truck, title: 'Transport', desc: 'Getting dogs to safety' },
];

export default function Donate() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-accent py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-10 h-10 text-primary mx-auto mb-4" />
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-primary-foreground">
            Support Our Mission
          </h1>
          <p className="font-body text-primary-foreground/60 mt-3 text-lg max-w-xl mx-auto">
            Your donation helps us continue saving lives and giving dogs the second chance they deserve.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 md:p-12 bg-card text-center border-2 border-primary/20">
            <h2 className="font-heading font-bold text-3xl text-foreground mb-4">Donate via Venmo</h2>
            <p className="font-body text-muted-foreground mb-6 max-w-md mx-auto">
              Scan the QR code below or search for us on Venmo to make a donation.
              Every dollar counts!
            </p>
            <div className="inline-block p-6 bg-white rounded-2xl shadow-lg mb-6">
              <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground font-body">QR Code Placeholder</span>
              </div>
            </div>
            <p className="font-body text-sm text-muted-foreground">
              Run Around Dog Town Rescue is a 501(c)(3) program of Charles Cisneros Post 16
            </p>
            <p className="font-body text-sm text-muted-foreground font-medium mt-1">
              EIN: 88-1942275
            </p>
            <p className="font-body text-xs text-muted-foreground mt-2">
              Your donation may be tax-deductible. Please consult your tax advisor.
            </p>
          </Card>
        </motion.div>

        <div className="mt-16">
          <h3 className="font-heading font-bold text-2xl text-foreground text-center mb-8">
            Your Support Helps Provide
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {impacts.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-5 rounded-xl bg-card border border-border"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-foreground">{item.title}</h4>
                  <p className="font-body text-sm text-muted-foreground mt-1">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}