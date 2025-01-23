'use client';

import React, { useEffect, useState } from 'react';
import CardChateau from '@/components/global/CardChateau';
import Chateau from '@/classes/Chateau';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ITEMS_PER_PAGE = 6;

const ChateauListPage: React.FC = () => {
  const [chateaux, setChateaux] = useState<Chateau[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchChateaux = async () => {
    setIsLoading(true);
    try {
      const { data, total } = await Chateau.getPaginated({
        page: currentPage,
        pageSize: ITEMS_PER_PAGE,
        searchQuery: searchQuery
      });
      
      setChateaux(data);
      setTotalItems(total);
    } catch (err) {
      console.error('Erreur lors de la récupération des châteaux :', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchChateaux();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [currentPage, searchQuery]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <div className="flex">
      <div className="container mx-auto p-4">
        <h1 className="mb-6 text-2xl font-bold">Liste des Châteaux</h1>

        <div className="mb-6">
          <Input
            placeholder="Rechercher un château..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {isLoading ? (
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {Array(ITEMS_PER_PAGE).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-[350px] rounded-md" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {chateaux.map((chateau) => (
                <CardChateau 
                  key={chateau.getIdChateau()} 
                  chateau={chateau} 
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 space-y-4">
                <div className="text-sm text-muted-foreground text-center">
                  {totalItems} châteaux trouvés - Page {currentPage}/{totalPages}
                </div>
                
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1 || isLoading}
                  >
                    Précédent
                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      onClick={() => setCurrentPage(i + 1)}
                      disabled={isLoading}
                      className="px-3 py-1 min-w-[40px]"
                    >
                      {i + 1}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages || isLoading}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChateauListPage;