'use client';

import React, { useEffect, useMemo, useState } from 'react';
import CardChasse from '@/components/CardChasse';
import Chasse from '@/classes/Chasse';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RatingStars } from '@/components/RatingStars';

const ChasseListPage: React.FC = () => {
  const [chasses, setChasses] = useState<any[]>([]);
  const [filteredChasses, setFilteredChasses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    duration: '',
    difficulty: '',
    noteMin: '',
    capacity: '',
    family: false,
    available: false,
  });

  const difficultyOptions = [
    { value: '1', label: 'Facile' },
    { value: '2', label: 'Moyen' },
    { value: '3', label: 'Difficile' },
  ];

  useEffect(() => {
    const fetchChasses = async () => {
      try {
        const everyChasses = await Chasse.getAllDisponibles();
        setChasses(everyChasses);
        setFilteredChasses(everyChasses);
      } catch (err) {
        console.error('Erreur lors de la récupération des chasses :', err);
      }
    };
    fetchChasses();
  }, []);

  const applyFilters = async () => {
    let filtered = [...chasses];

    if (filters.minPrice) {
      filtered = filtered.filter((chasse) => chasse.getPrix() >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((chasse) => chasse.getPrix() <= parseInt(filters.maxPrice));
    }
    if (filters.duration) {
      filtered = filtered.filter((chasse) => chasse.getDureeEstime() <= parseInt(filters.duration));
    }
    if (filters.difficulty) {
      filtered = filtered.filter(
        (chasse) => chasse.getDifficulte() <= parseInt(filters.difficulty)
      );
    }
    if (filters.noteMin) {
      const filteredWithNotes = await Promise.all(
        filtered.map(async (chasse) => ({
          chasse,
          noteMoyenne: await chasse.getNoteMoyenne(),
        }))
      );
      filtered = filteredWithNotes
        .filter(({ noteMoyenne }) => noteMoyenne >= parseFloat(filters.noteMin))
        .map(({ chasse }) => chasse);
    }
    if (filters.capacity) {
      filtered = filtered.filter((chasse) => chasse.getCapacite() <= parseInt(filters.capacity));
    }
    if (filters.family) {
      filtered = filtered.filter((chasse) => chasse.isFamilyFriendly());
    }
    if (filters.available) {
      filtered = filtered.filter((chasse) => chasse.isAvailable());
    }

    setFilteredChasses(filtered);
  };

  const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    applyFilters();
  };

  const handleResetFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      duration: '',
      difficulty: '',
      noteMin: '',
      capacity: '',
      family: false,
      available: false,
    });
    setFilteredChasses(chasses);
  };

  const filteredHunts = useMemo(() => {
    if (!searchQuery) return filteredChasses;
    return filteredChasses.filter((chasse) =>
      chasse.getTitre().toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [filteredChasses, searchQuery]);

  return (
    <div className="flex flex-col gap-6 p-6 lg:flex-row">
      <Card className="h-fit w-full lg:w-1/4">
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFilterSubmit} className="space-y-4">
            {/* Min Price */}
            <div>
              <Label htmlFor="minPrice">Prix min</Label>
              <Input
                type="number"
                name="minPrice"
                max={filters.maxPrice}
                min={0}
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              />
            </div>
            {/* Max Price */}
            <div>
              <Label htmlFor="maxPrice">Prix max</Label>
              <Input
                type="number"
                name="maxPrice"
                min={filters.minPrice || 0}
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              />
            </div>
            {/* Duration */}
            <div>
              <Label htmlFor="duration">Durée max (en minutes)</Label>
              <Input
                type="number"
                name="duration"
                min={0}
                value={filters.duration}
                onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
              />
            </div>
            {/* Difficulty */}
            <div>
              <Label htmlFor="difficulty">Difficulté max</Label>
              <Select
                name="difficulty"
                value={filters.difficulty}
                onValueChange={(value) => setFilters({ ...filters, difficulty: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une difficulté" />
                </SelectTrigger>
                <SelectContent>
                  {difficultyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Minimal Note */}
            <div>
              <Label htmlFor="noteMin">Note minimum</Label>
              <RatingStars
                value={filters.noteMin ? parseFloat(filters.noteMin) : 0}
                onChange={(value) => setFilters({ ...filters, noteMin: value.toString() })}
              />
            </div>
            {/* Capacity */}
            <div>
              <Label htmlFor="capacity">Capacité max</Label>
              <Input
                type="number"
                name="capacity"
                value={filters.capacity}
                onChange={(e) => setFilters({ ...filters, capacity: e.target.value })}
              />
            </div>
            {/* Family Friendly */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="family"
                checked={filters.family}
                onCheckedChange={(checked) => setFilters({ ...filters, family: !!checked })}
              />
              <Label htmlFor="family">Pensé pour les familles</Label>
            </div>
            {/* Available Now */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="available"
                checked={filters.available}
                onCheckedChange={(checked) => setFilters({ ...filters, available: !!checked })}
              />
              <Label htmlFor="available">Disponible Maintenant</Label>
            </div>
            {/* Buttons */}
            <Button type="submit" className="w-full">
              Filtrer
            </Button>
            <Button type="reset" onClick={handleResetFilters} className="w-full" variant="outline">
              Réinitialiser
            </Button>
          </form>
        </CardContent>
      </Card>
      {/* Hunts List */}
      <div className="w-full">
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Rechercher une chasse..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Separator className="my-6" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHunts.map((chasse) => (
            <CardChasse key={chasse.getIdChasse()} chasse={chasse} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChasseListPage;
