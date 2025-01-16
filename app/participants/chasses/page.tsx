'use client';

import React, { useEffect, useMemo, useState } from 'react';
import CardChasse from '@/components/global/CardChasse';
import Chasse from '@/classes/Chasse';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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

  // Récupérer toutes les chasses
  useEffect(() => {
    const fetchChasses = async () => {
      try {
        const everyChasses = await Chasse.getAllDisponibles();
        setChasses(everyChasses);
        setFilteredChasses(everyChasses); // Initialement, toutes les chasses sont affichées
      } catch (err) {
        console.error('Erreur lors de la récupération des chasses :', err);
      }
    };

    fetchChasses();
  }, []);

  if (!filteredChasses) {
    return <p>Chargement...</p>;
  }

  // Appliquer les filtres
  const applyFilters = async () => {


    let filtered = [...chasses];

    if (filters.minPrice) {
      filtered = filtered.filter((chasse) => chasse.getPrix() >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((chasse) => chasse.getPrix() <= parseInt(filters.maxPrice));
    }
    if (filters.duration) {
      filtered = filtered.filter((chasse) => chasse.getDureeEstimee() <= parseInt(filters.duration));
    }
    if (filters.difficulty) {
      filtered = filtered.filter((chasse) => chasse.getDifficulte() <= parseInt(filters.difficulty));
    }
    if (filters.noteMin) {
      // Utiliser Promise.all pour gérer l'asynchronisme
      const filteredWithNotes = await Promise.all(
        filtered.map(async (chasse) => ({
          chasse,
          noteMoyenne: await chasse.getNoteMoyenne(),
        }))
      );
  
      filtered = filteredWithNotes
        .filter(({ noteMoyenne }) => noteMoyenne >= parseInt(filters.noteMin))
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

  // Gérer la soumission du formulaire de filtre
  const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    applyFilters();
  };

  // Réinitialiser les filtres
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

  // Filtrer les chasses par recherche textuelle
  const filteredHunts = useMemo(() => {
    if (!searchQuery) return filteredChasses;

    return filteredChasses.filter((chasse) =>
      chasse.getTitre().toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [filteredChasses, searchQuery]);

  return (
    <div className="flex">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Liste des Chasses</h1>

        {/* Barre de recherche */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Rechercher une chasse..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filtre des chasses */}
        <div className="border p-4 rounded-md shadow-md">
          <h2 className="text-2xl mb-3">Filtre</h2>
          <form onSubmit={handleFilterSubmit}>
            <div className="mb-3">
              <label htmlFor="minPrice">Prix min</label>
              <Input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="maxPrice">Prix max</label>
              <Input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="duration">Durée max</label>
              <Input
                type="number"
                name="duration"
                value={filters.duration}
                onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="difficulty">Difficulté max</label>
              <Input
                type="number"
                name="difficulty"
                value={filters.difficulty}
                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="noteMin">Note minimum</label>
              <Input
                type="number"
                name="noteMin"
                value={filters.noteMin}
                onChange={(e) => setFilters({ ...filters, noteMin: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="capacity">Capacité max</label>
              <Input
                type="number"
                name="capacity"
                value={filters.capacity}
                onChange={(e) => setFilters({ ...filters, capacity: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="family">Pensé pour les familles</label>
              <Input
                type="checkbox"
                name="family"
                checked={filters.family}
                onChange={(e) => setFilters({ ...filters, family: e.target.checked })}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="available">Disponible Maintenant</label>
              <Input
                type="checkbox"
                name="available"
                checked={filters.available}
                onChange={(e) => setFilters({ ...filters, available: e.target.checked })}
              />
            </div>
            <Button type="submit">Filtrer</Button>
            <Button type="reset" onClick={handleResetFilters}>
              Réinitialiser
            </Button>
          </form>
        </div>

        {/* Liste des chasses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHunts.map((chasse) => (
            <CardChasse key={chasse.getIdChasse()} chasse={chasse} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChasseListPage;
