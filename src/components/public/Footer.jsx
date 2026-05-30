import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, PawPrint } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-accent text-accent-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <PawPrint className="w-6 h-6 text-primary" />
              <h3 className="font-heading font-bold text-xl text-primary-foreground">
                Run Around Dog Town Rescue
              </h3>
            </div>
            <p className="font-body text-sm text-primary-foreground/70 leading-relaxed">
              A 501(c)(3) nonprofit program dedicated to rescuing, rehabilitating, and rehoming
              abandoned, neglected, and at-risk dogs across Northern New Mexico.
            </p>
            <p className="font-body text-xs text-primary-foreground/50 mt-3">
              EIN: 88-1942275 · A program of Charles Cisneros Post 16
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg text-primary-foreground mb-4">Quick Links</h4>
            <div className="space-y-2 font-body text-sm">
              <Link to="/dogs" className="block text-primary-foreground/70 hover:text-primary transition-colors">
                Adoptable Dogs
              </Link>
              <Link to="/about" className="block text-primary-foreground/70 hover:text-primary transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="block text-primary-foreground/70 hover:text-primary transition-colors">
                Contact Us
              </Link>
              <Link to="/donate" className="block text-primary-foreground/70 hover:text-primary transition-colors">
                Donate
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg text-primary-foreground mb-4">Contact</h4>
            <div className="space-y-3 font-body text-sm">
              <div className="flex items-center gap-2 text-primary-foreground/70">
                <Phone className="w-4 h-4 text-primary" />
                <span>Chris: 575-770-8688</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/70">
                <Phone className="w-4 h-4 text-primary" />
                <span>Sharon: 575-779-7721</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/70">
                <Mail className="w-4 h-4 text-primary" />
                <span>RunAroundDogTown@gmail.com</span>
              </div>
              <p className="text-primary-foreground/50 text-xs mt-2">Costilla, New Mexico</p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-10 pt-6 text-center">
          <p className="font-body text-xs text-primary-foreground/40 flex items-center justify-center gap-1">
            Every dog deserves a chance <Heart className="w-3 h-3 text-primary" /> A cause for healing paws.
          </p>
        </div>
      </div>
    </footer>
  );
}