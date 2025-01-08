import { ClipboardList, Clock, BarChart2 } from 'lucide-react'
import React from 'react'
import { TitleTwo } from "@/components/ui/TitleTwo";

const Features = () => {
  return (
    <section className="w-full py-10 md:py-20 lg:py-32 bg-[#f7f7f7]" id="features">
      <div className="container px-4 md:px-6">
        <TitleTwo text={"Pourquoi choisir Château Trésor ?"} color="dark" />
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
          <div className="flex flex-col items-center space-y-2 border-[#d1d1d1] p-4 rounded-lg">
            <div className="p-2 bg-[#e7f0f8] rounded-full">
              <ClipboardList className="h-6 w-6 text-[#2b4e73]" />
            </div>
            <h3 className="text-xl font-bold text-[#2b4e73]">recherche simplifiée</h3>
            <p className="text-muted-foreground text-center text-[#6c757d]">
              Centralisation des chasses sur un seul site, plus besoin de chercher sur le site du château directement.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 border-[#d1d1d1] p-4 rounded-lg">
            <div className="p-2 bg-[#e7f0f8] rounded-full">
              <Clock className="h-6 w-6 text-[#2b4e73]" />
            </div>
            <h3 className="text-xl font-bold text-[#2b4e73]">Gagnez du temps</h3>
            <p className="text-muted-foreground text-center text-[#6c757d]">
              Réduisez le temps passé à devoir contacter les organisateurs, avec Château Trésor la communication est directement sur le site.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 border-[#d1d1d1] p-4 rounded-lg">
            <div className="p-2 bg-[#e7f0f8] rounded-full">
              <BarChart2 className="h-6 w-6 text-[#2b4e73]" />
            </div>
            <h3 className="text-xl font-bold text-[#2b4e73]">Données claires</h3>
            <p className="text-muted-foreground text-center text-[#6c757d]">
              Pour chaque chasse, une description complète du château est présente ainsi que le profil des organisateurs et propriétaire du château.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;

