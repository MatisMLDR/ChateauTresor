import { ClipboardList, Clock, BarChart2 } from 'lucide-react'
import React from 'react'

const Features = () => {
  return (
    <section className="w-full py-10 md:py-20 lg:py-32 bg-[#f7f7f7]" id="features">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-4 text-[#2b4e73]">
          Pourquoi choisir Château Trésor ?
        </h2>
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
          <div className="flex flex-col items-center space-y-2 border-[#d1d1d1] p-4 rounded-lg">
            <div className="p-2 bg-[#e7f0f8] rounded-full">
              <ClipboardList className="h-6 w-6 text-[#2b4e73]" />
            </div>
            <h3 className="text-xl font-bold text-[#2b4e73]">Organisation simplifiée</h3>
            <p className="text-muted-foreground text-center text-[#6c757d]">
              Centralisez toutes vos chasses au trésor et clients dans un tableau de bord clair.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 border-[#d1d1d1] p-4 rounded-lg">
            <div className="p-2 bg-[#e7f0f8] rounded-full">
              <Clock className="h-6 w-6 text-[#2b4e73]" />
            </div>
            <h3 className="text-xl font-bold text-[#2b4e73]">Gagnez du temps</h3>
            <p className="text-muted-foreground text-center text-[#6c757d]">
              Réduisez le temps passé à gérer des outils complexes grâce à notre solution intuitive.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 border-[#d1d1d1] p-4 rounded-lg">
            <div className="p-2 bg-[#e7f0f8] rounded-full">
              <BarChart2 className="h-6 w-6 text-[#2b4e73]" />
            </div>
            <h3 className="text-xl font-bold text-[#2b4e73]">Données claires</h3>
            <p className="text-muted-foreground text-center text-[#6c757d]">
              Suivez vos finances et vos résultats avec des données accessibles en un clin d'œil.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;

