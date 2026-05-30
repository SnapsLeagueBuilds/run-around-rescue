import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Users, Mail, Loader2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

export default function UserManagement() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [email, setEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState('');
  const [inviteError, setInviteError] = useState('');

  useEffect(() => {
    // Get current logged in user from Supabase
    base44.auth.getUser()
      .then(({ data: { user } }) => {
        if (user) {
          // Get the role from user metadata
          setCurrentUser({
            ...user,
            role: user.user_metadata?.role || 'user',
            full_name: user.user_metadata?.full_name || user.email,
            email: user.email
          });
        }
      })
      .finally(() => setLoadingUser(false));
  }, []);

  const { data: users = [], isLoading: loadingUsers, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      // Fetch all users from your profiles table in Supabase
      const { data, error } = await base44
        .from('profiles')
        .select('*')
        .eq('role', 'admin');
      if (error) throw error;
      return data;
    },
    enabled: !loadingUser && currentUser?.role === 'admin',
  });

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviting(true);
    setInviteSuccess('');
    setInviteError('');

    try {
      // Invite user via Supabase Auth
      const { error } = await base44.auth.admin.inviteUserByEmail(email, {
        data: { role: 'admin' }
      });
      if (error) throw error;
      setInviteSuccess(`Invitation sent to ${email}!`);
      setEmail('');
      refetch();
    } catch (error) {
      setInviteError(error.message || 'Failed to send invitation');
    } finally {
      setInviting(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <ShieldAlert className="w-14 h-14 text-destructive" />
        <h2 className="font-heading font-bold text-2xl text-foreground">Access Denied</h2>
        <p className="font-body text-muted-foreground max-w-sm">
          Only admins can manage users. Please contact your administrator.
        </p>
      </div>
    );
  }

  const adminUsers = users.filter(u => u.role === 'admin');

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="font-heading font-bold text-3xl text-foreground">User Management</h1>
        <p className="font-body text-muted-foreground mt-1">Invite and manage admin users.</p>
      </div>

      {/* Invite Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" /> Invite New Admin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 space-y-1">
                <Label className="font-body">Email Address</Label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="font-body"
                />
              </div>
              <Button
                onClick={handleInvite}
                disabled={inviting}
                className="sm:self-end bg-primary hover:bg-primary/90 font-body gap-2"
              >
                {inviting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                ) : (
                  <><Mail className="w-4 h-4" /> Send Invite</>
                )}
              </Button>
            </div>
            {inviteSuccess && (
              <div className="mt-3 flex items-center gap-2 text-green-600 font-body text-sm">
                <CheckCircle2 className="w-4 h-4" /> {inviteSuccess}
              </div>
            )}
            {inviteError && (
              <div className="mt-3 text-destructive font-body text-sm">{inviteError}</div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Current Admins */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Current Admins ({adminUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingUsers ? (
              <div className="flex justify-center py-6">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : adminUsers.length === 0 ? (
              <p className="font-body text-muted-foreground text-sm text-center py-4">No admin users found.</p>
            ) : (
              <div className="divide-y divide-border">
                {adminUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-body font-medium text-foreground">{user.full_name || '—'}</p>
                      <p className="font-body text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/20">Admin</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}