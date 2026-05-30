import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Pencil, Trash2, PawPrint, Heart, RotateCcw } from 'lucide-react';

export default function DogCard({ dog, statusStyles, onEdit, onDelete, onMemorial, onRestore }) {
  const isMemorial = dog.status === 'Memorial';

  return (
    <Card className={`overflow-hidden bg-card ${isMemorial ? 'opacity-80' : ''}`}>
      <div className="aspect-[16/10] overflow-hidden relative">
        {dog.photo_url ? (
          <img
            src={dog.photo_url}
            alt={dog.name}
            className={`w-full h-full object-cover ${isMemorial ? 'grayscale' : ''}`}
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <PawPrint className="w-12 h-12 text-muted-foreground/20" />
          </div>
        )}
        <Badge className={`absolute top-2 right-2 ${statusStyles[dog.status] || ''} font-body text-xs`}>
          {dog.status}
        </Badge>
        {isMemorial && (
          <div className="absolute top-2 left-2">
            <Heart className="w-5 h-5 text-white/80 fill-white/50" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-heading font-bold text-lg">{dog.name}</h3>
        <p className="font-body text-sm text-muted-foreground">{dog.breed}{dog.age ? ` · ${dog.age}` : ''}{dog.gender ? ` · ${dog.gender}` : ''}</p>
        {isMemorial && dog.memorial_note && (
          <p className="font-body text-xs text-muted-foreground italic mt-1 line-clamp-2">"{dog.memorial_note}"</p>
        )}
        <div className="flex gap-2 mt-4 flex-wrap">
          <Button size="sm" variant="outline" className="flex-1 font-body gap-1" onClick={() => onEdit(dog)}>
            <Pencil className="w-3 h-3" /> Edit
          </Button>

          {!isMemorial && onMemorial && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="outline" className="font-body gap-1 text-gray-600 hover:text-gray-800">
                  <Heart className="w-3 h-3" /> Memorial
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-heading">Move {dog.name} to Memorial Wall?</AlertDialogTitle>
                  <AlertDialogDescription className="font-body">
                    This will move {dog.name} to the memorial section. You can add a personal note when editing, and restore them back if needed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="font-body">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-primary text-primary-foreground font-body"
                    onClick={() => onMemorial(dog)}
                  >
                    Move to Memorial
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {isMemorial && onRestore && (
            <Button size="sm" variant="outline" className="font-body gap-1 text-blue-600 hover:text-blue-800" onClick={() => onRestore(dog)}>
              <RotateCcw className="w-3 h-3" /> Restore
            </Button>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="outline" className="text-destructive hover:text-destructive font-body gap-1">
                <Trash2 className="w-3 h-3" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="font-heading">Delete {dog.name}?</AlertDialogTitle>
                <AlertDialogDescription className="font-body">
                  This action cannot be undone. This will permanently remove this dog listing.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="font-body">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground font-body"
                  onClick={() => onDelete(dog.id)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Card>
  );
}