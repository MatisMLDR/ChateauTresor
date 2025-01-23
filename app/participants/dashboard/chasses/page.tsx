'use client';

import React, { useEffect, useMemo, useState } from 'react';
import CardChasse from '@/components/global/CardChasse';
import Chasse from '@/classes/Chasse';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import RangeSlider from '@/components/ui/RangeSlider';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RatingStars } from '@/components/RatingStars';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

const ChasseListPage: React.FC = () => {
  const [chasses, setChasses] = useState<any[]>([]);
  const [filteredChasses, setFilteredChasses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const minPrice = 0; // Connecter à la base de donnéees
  const maxPrice = 100; // Idem
  const [filters, setFilters] = useState({
    priceRange: [minPrice, maxPrice] as [number, number],
    duration: '',
    difficulty: '',
    noteMin: '',
    capacity: '',
    family: false,
    available: false,
  });
  const [loading, setLoading] = useState(true);

  const difficultyOptions = [
    { value: '1', label: 'Facile' },
    { value: '2', label: 'Moyen' },
    { value: '3', label: 'Difficile' },
  ];

  const handlePriceRangeChange = (newRange: [number, number]) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      priceRange: newRange,
    }));
  };

  useEffect(() => {
    const fetchChasses = async () => {
      setLoading(true);
      try {
        const everyChasses = await Chasse.getAllDisponibles();
        setChasses(everyChasses);
        setFilteredChasses(everyChasses);
      } catch (err) {
        console.error('Erreur lors de la récupération des chasses :', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChasses();
  }, []);

  const applyFilters = async () => {
    let filtered = [...chasses];

    if (filters.priceRange) {
      const [minPrice, maxPrice] = filters.priceRange;
      filtered = filtered.filter(
        (chasse) => chasse.getPrix() >= minPrice && chasse.getPrix() <= maxPrice
      );
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
      priceRange: [minPrice, maxPrice] as [number, number],
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
            {/* Price Range */}
            <div>
              <Label htmlFor="priceRange">Prix</Label>
              <RangeSlider
                min={minPrice}
                max={maxPrice}
                defaultValue={filters.priceRange}
                onValueChange={handlePriceRangeChange}
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
            {/* Disponible Maintenant */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="available"
                checked={filters.available}
                onCheckedChange={(checked) => setFilters({ ...filters, available: !!checked })}
              />
              <Label htmlFor="available">Disponible Maintenant</Label>
            </div>
            {/* Boutons */}
            <Button type="submit" className="w-full">
              Filtrer
            </Button>
            <Button type="reset" onClick={handleResetFilters} className="w-full" variant="outline">
              Réinitialiser
            </Button>
          </form>
        </CardContent>
      </Card>
      {/* Liste des chasses */}
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
          {loading
            ? // Affichages de 6 fausses chasses pour le chargement
              Array.from({ length: 6 }, (_, index) => (
                <Skeleton key={index} className="h-[350px] rounded-md" />
              ))
            : // Affichage des vraies chasses
              filteredHunts.map((chasse) => (
                <CardChasse key={chasse.getIdChasse()} chasse={chasse} />
              ))}
        </div>
      </div>
    </div>
  );
};

export default ChasseListPage;
