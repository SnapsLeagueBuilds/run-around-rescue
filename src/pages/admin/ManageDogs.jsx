import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, PawPrint, Loader2, Heart } from 'lucide-react';
import DogForm from '@/components/admin/DogForm';
import DogCard from '@/components/admin/DogCard';

export default function ManageDogs() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingDog, setEditingDog] = useState(null);
  const queryClient = useQueryClient();

  const { data: dogs = [], isLoading } = useQuery({
    queryKey: ['admin-dogs'],
    queryFn: async () => {
      const { data, error } = await base44
        .from('dogs')
        .select('*')
        .order('created_date', { ascending: false })
        .limit(200);
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const { error } = await base44
        .from('dogs')
        .insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dogs'] });
      setFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const { error } = await base44
        .from('dogs')
        .update(data)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dogs'] });
      setFormOpen(false);
      setEditingDog(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await base44
        .from('dogs')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-dogs'] }),
  });

  const handleSave = async (data) => {
    if (editingDog) {
      await updateMutation.mutateAsync({ id: editingDog.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleEdit = (dog) => {
    setEditingDog(dog);
    setFormOpen(true);
  };

  const statusStyles = {
    Available: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Adopted: 'bg-blue-100 text-blue-800',
    Memorial: 'bg-gray-100 text-gray-600',
  };

  const activeDogs = dogs.filter(d => d.status !== 'Memorial');
  const memorialDogs = dogs.filter(d => d.status === 'Memorial');

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-foreground">Manage Dogs</h1>
          <p className="font-body text-muted-foreground mt-1">Add, edit, and manage adoptable dogs.</p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 font-body gap-2"
          onClick={() => { setEditingDog(null); setFormOpen(true); }}
        >
          <Plus className="w-4 h-4" /> Add Dog
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : dogs.length === 0 ? (
        <Card className="p-12 text-center">
          <PawPrint className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <p className="font-body text-muted-foreground text-lg mb-4">No dogs added yet</p>
          <Button onClick={() => { setEditingDog(null); setFormOpen(true); }} className="font-body gap-2">
            <Plus className="w-4 h-4" /> Add Your First Dog
          </Button>
        </Card>
      ) : (
        <div className="space-y-10">
          {/* Active Dogs */}
          <div>
            <h2 className="font-heading font-semibold text-lg text-foreground mb-4">Active Dogs ({activeDogs.length})</h2>
            {activeDogs.length === 0 ? (
              <p className="font-body text-muted-foreground text-sm">No active dogs.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {activeDogs.map(dog => (
                  <DogCard
                    key={dog.id}
                    dog={dog}
                    statusStyles={statusStyles}
                    onEdit={handleEdit}
                    onDelete={id => deleteMutation.mutate(id)}
                    onMemorial={dog => updateMutation.mutate({ id: dog.id, data: { ...dog, status: 'Memorial' } })}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Memorial Dogs */}
          {memorialDogs.length > 0 && (
            <div>
              <h2 className="font-heading font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" /> Memorial Wall ({memorialDogs.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {memorialDogs.map(dog => (
                  <DogCard
                    key={dog.id}
                    dog={dog}
                    statusStyles={statusStyles}
                    onEdit={handleEdit}
                    onDelete={id => deleteMutation.mutate(id)}
                    onRestore={dog => updateMutation.mutate({ id: dog.id, data: { ...dog, status: 'Available' } })}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <Dialog open={formOpen} onOpenChange={(open) => { setFormOpen(open); if (!open) setEditingDog(null); }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              {editingDog ? `Edit ${editingDog.name}` : 'Add New Dog'}
            </DialogTitle>
          </DialogHeader>
          <DogForm
            dog={editingDog}
            onSave={handleSave}
            onCancel={() => { setFormOpen(false); setEditingDog(null); }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}