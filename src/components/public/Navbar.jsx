import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, Heart, PawPrint } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { label: 'Home', path: '/' },
    { label: 'Adoptable Dogs', path: '/dogs' },
    { label: 'Events', path: '/events' },
    { label: 'Memorial', path: '/memorial' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2">
            <PawPrint className="w-7 h-7 text-primary" />
            <div className="font-heading font-bold text-lg md:text-xl text-foreground leading-tight">
              Run Around<br className="hidden sm:block" />
              <span className="text-primary">Dog Town Rescue</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <Link key={link.path} to={link.path}>
                <Button
                  variant={isActive(link.path) ? "default" : "ghost"}
                  size="sm"
                  className={`font-body text-sm ${isActive(link.path) ? '' : 'text-foreground hover:text-primary'}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            <Link to="/donate">
              <Button size="sm" className="ml-2 bg-primary hover:bg-primary/90 font-body gap-1">
                <Heart className="w-4 h-4" /> Donate
              </Button>
            </Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4 space-y-1">
          {links.map(link => (
            <Link key={link.path} to={link.path} onClick={() => setOpen(false)}>
              <Button
                variant={isActive(link.path) ? "default" : "ghost"}
                className="w-full justify-start font-body"
              >
                {link.label}
              </Button>
            </Link>
          ))}
          <Link to="/donate" onClick={() => setOpen(false)}>
            <Button className="w-full bg-primary hover:bg-primary/90 font-body gap-1 mt-2">
              <Heart className="w-4 h-4" /> Donate
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
}