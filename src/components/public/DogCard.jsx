import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Heart, PawPrint } from 'lucide-react';
import { motion } from 'framer-motion';

const statusStyles = {
  Available: 'bg-green-100 text-green-800 border-green-200',
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Adopted: 'bg-blue-100 text-blue-800 border-blue-200',
};

export default function DogCard({ dog, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/dogs/${dog.id}`}>
        <Card className="group overflow-hidden border-border hover:shadow-xl transition-all duration-500 cursor-pointer bg-card">
          <div className="aspect-[4/3] overflow-hidden relative">
            {dog.photo_url ? (
              <img
                src={dog.photo_url}
                alt={dog.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <PawPrint className="w-16 h-16 text-muted-foreground/30" />
              </div>
            )}
            <div className="absolute top-3 right-3">
              <Badge className={`${statusStyles[dog.status] || statusStyles.Available} border font-body text-xs`}>
                {dog.status}
              </Badge>
            </div>
          </div>
          <div className="p-5">
            <h3 className="font-heading font-bold text-xl text-foreground group-hover:text-primary transition-colors">
              {dog.name}
            </h3>
            <p className="font-body text-sm text-muted-foreground mt-1">
              {dog.breed} · {dog.age} · {dog.gender}
            </p>
            {dog.description && (
              <p className="font-body text-sm text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
                {dog.description}
              </p>
            )}
            <div className="flex items-center gap-1 mt-4 text-primary font-body text-sm font-medium group-hover:gap-2 transition-all">
              <Heart className="w-4 h-4" />
              <span>Learn more</span>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}