import React from 'react';
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin, Heart } from 'lucide-react';
import InquiryForm from '@/components/public/InquiryForm';
import { motion } from 'framer-motion';

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-accent py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-10 h-10 text-primary mx-auto mb-4" />
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-primary-foreground">
            Contact Us
          </h1>
          <p className="font-body text-primary-foreground/60 mt-3 text-lg max-w-xl mx-auto">
            Have questions? We'd love to hear from you.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-6"
          >
            <div>
              <h2 className="font-heading font-bold text-2xl text-foreground mb-6">Get In Touch</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div className="font-body">
                    <p className="font-medium text-foreground">Chris</p>
                    <p className="text-muted-foreground">575-770-8688</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div className="font-body">
                    <p className="font-medium text-foreground">Sharon</p>
                    <p className="text-muted-foreground">575-779-7721</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div className="font-body">
                    <p className="font-medium text-foreground">Email</p>
                    <p className="text-muted-foreground">RunAroundDogTown@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div className="font-body">
                    <p className="font-medium text-foreground">Location</p>
                    <p className="text-muted-foreground">Costilla, New Mexico</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <Card className="p-6 md:p-8 bg-card">
              <h3 className="font-heading font-bold text-xl text-foreground mb-6">Send Us a Message</h3>
              <InquiryForm dogName="" dogId="" />
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}