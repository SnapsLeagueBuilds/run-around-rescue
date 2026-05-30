import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { PawPrint, Dog, MessageSquare, LogOut, Home, Users, CalendarDays, Search } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AdminLayout() {
  const location = useLocation();

  const links = [
    { label: 'Manage Dogs', path: '/admin', icon: Dog },
    { label: 'Inquiries', path: '/admin/inquiries', icon: MessageSquare },
    { label: 'Events', path: '/admin/events', icon: CalendarDays },
    { label: 'SEO & Analytics', path: '/admin/seo', icon: Search },
    { label: 'User Management', path: '/admin/users', icon: Users },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-card border-r border-border p-6 hidden md:flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <PawPrint className="w-6 h-6 text-primary" />
          <span className="font-heading font-bold text-lg">Admin Portal</span>
        </div>

        <nav className="flex-1 space-y-1">
          {links.map(link => (
            <Link key={link.path} to={link.path}>
              <Button
                variant={isActive(link.path) ? "default" : "ghost"}
                className="w-full justify-start gap-2 font-body"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="pt-4 border-t border-border space-y-1">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start gap-2 font-body text-sm">
              <Home className="w-4 h-4" /> View Website
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 font-body text-sm text-destructive"
            onClick={() => base44.auth.signOut().then(() => window.location.href = '/login')}
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex-1 flex flex-col">
        <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <PawPrint className="w-5 h-5 text-primary" />
            <span className="font-heading font-bold">Admin</span>
          </div>
          <div className="flex gap-1">
            {links.map(link => (
              <Link key={link.path} to={link.path}>
                <Button
                  size="sm"
                  variant={isActive(link.path) ? "default" : "ghost"}
                >
                  <link.icon className="w-4 h-4" />
                </Button>
              </Link>
            ))}
          </div>
        </div>
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}