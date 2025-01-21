"use client";

import { useEffect, useState } from "react";
import { ChateauType, ChasseType } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import Chateau from "@/classes/Chateau";
import Loader from '@/components/global/loader';
import { Button } from "@/components/ui/button";

interface SelectionChateauProps {
  formData: Partial<ChasseType>;
  setFormData: (data: Partial<ChasseType>) => void;
  onValidityChange: (isValid: boolean) => void;
  onNext?: () => void;
}

export function CastleSelection({ formData, setFormData, onValidityChange, onNext }: SelectionChateauProps) {
  const [chateaux, setChateaux] = useState<ChateauType[]>([]);
  const [filteredChateaux, setFilteredChateaux] = useState<ChateauType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [chargement, setChargement] = useState<boolean>(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [chateauxPerPage] = useState<number>(4);
  const [isFormValid, setIsFormValid] = useState(false);

  // Validation du formulaire
  useEffect(() => {
    const validateForm = () => {
      const { id_chateau, date_debut, date_fin, horaire_debut, horaire_fin, capacite } = formData;

      const isChateauValid = !!id_chateau;
      const isDateDebutValid = !!date_debut;
      const isDateFinValid = !!date_fin;
      const isHoraireDebutValid = !!horaire_debut;
      const isHoraireFinValid = !!horaire_fin;
      const isCapaciteValid = capacite !== undefined && capacite > 0;

      return isChateauValid && isDateDebutValid && isDateFinValid && 
             isHoraireDebutValid && isHoraireFinValid && isCapaciteValid;
    };

    const isValid = validateForm();
    setIsFormValid(isValid);
    onValidityChange(isValid);
  }, [formData, onValidityChange]);

  // Chargement des châteaux
  useEffect(() => {
    const chargerChateaux = async () => {
      try {
        setChargement(true);
        const tousLesChateaux = await Chateau.getAllChateaux();
        
        const chateauxFormatted = tousLesChateaux.map((chateau) => ({
          id_chateau: chateau.getIdChateau(),
          nom: chateau.getNom(),
          localisation: chateau.getLocalisation(),
          description: chateau.getDescription(),
          image: chateau.getImage(),
        }));

        setChateaux(chateauxFormatted);
        setFilteredChateaux(chateauxFormatted);

        if (formData.id_chateau) {
          const chateauExist = chateauxFormatted.find(
            c => c.id_chateau === formData.id_chateau
          );
          if (chateauExist) {
            setSearchTerm(chateauExist.nom || "");
          }
        }
      } catch (err) {
        console.error(err);
        setErreur("Erreur lors du chargement des châteaux.");
      } finally {
        setChargement(false);
      }
    };

    chargerChateaux();
  }, []);

  // Filtrage des châteaux en fonction de la recherche
  useEffect(() => {
    const filtered = chateaux.filter((chateau) =>
      chateau.nom?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredChateaux(filtered);
    setCurrentPage(1);
  }, [searchTerm, chateaux]);

  const indexOfLastChateau = currentPage * chateauxPerPage;
  const indexOfFirstChateau = indexOfLastChateau - chateauxPerPage;
  const currentChateaux = filteredChateaux.slice(indexOfFirstChateau, indexOfLastChateau);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (chargement) {
    return <Loader />;
  }

  if (erreur) {
    return <p className="text-red-500">{erreur}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="search">Rechercher un château</Label>
        <Input
          id="search"
          type="text"
          placeholder="Rechercher par nom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        <Label className="flex items-center gap-1">
          Sélectionner un château
          <span className="text-red-500">*</span>
        </Label>
        <RadioGroup
          value={formData.id_chateau?.toString()}
          onValueChange={(valeur) => {
            const chateauSelectionne = chateaux.find(
              (chateau) => chateau.id_chateau.toString() === valeur
            );
            console.log("Château sélectionné :", chateauSelectionne); // Debug
            setFormData({ 
              ...formData, 
              id_chateau: valeur as `${string}-${string}-${string}-${string}-${string}`, // Correction du type
              chateau: chateauSelectionne 
            });
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentChateaux.length === 0 ? (
              <p className="text-muted-foreground">Aucun château trouvé.</p>
            ) : (
              currentChateaux.map((chateau) => (
                <Card
                  key={chateau.id_chateau}
                  className={`cursor-pointer transition-all ${
                    formData.chateau?.id_chateau === chateau.id_chateau 
                      ? "ring-2 ring-primary" 
                      : ""
                  }`}
                  onClick={() => {
                    console.log("Château cliqué :", chateau); // Debug
                    setFormData({ 
                      ...formData, 
                      id_chateau: chateau.id_chateau as `${string}-${string}-${string}-${string}-${string}`, // Correction du type
                      chateau 
                    });
                  }}
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={chateau.image instanceof File 
                          ? URL.createObjectURL(chateau.image) 
                          : chateau.image || "https://via.placeholder.com/300x200"}
                        alt={chateau.nom}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <RadioGroupItem
                          value={chateau.id_chateau.toString()}
                          id={chateau.id_chateau.toString()}
                          className="sr-only"
                        />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{chateau.nom}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4" />
                        {chateau.localisation || "Non spécifiée"}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {chateau.description || "Pas de description"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </RadioGroup>

        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Précédent
          </Button>
          {Array.from({ length: Math.ceil(filteredChateaux.length / chateauxPerPage) }, (_, i) => (
            <Button
              key={i + 1}
              variant={currentPage === i + 1 ? "default" : "outline"}
              onClick={() => paginate(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredChateaux.length / chateauxPerPage)}
          >
            Suivant
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-1" htmlFor="date_debut">
            Date de début
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="date_debut"
            type="date"
            required
            value={formData.date_debut || ""}
            onChange={(e) => setFormData({ ...formData, date_debut: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-1" htmlFor="date_fin">
            Date de fin
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="date_fin"
            type="date"
            required
            value={formData.date_fin || ""}
            onChange={(e) => setFormData({ ...formData, date_fin: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-1" htmlFor="horaire_debut">
            Heure de début
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="horaire_debut"
            type="time"
            required
            value={formData.horaire_debut || ""}
            onChange={(e) => setFormData({ ...formData, horaire_debut: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-1" htmlFor="horaire_fin">
            Heure de fin
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="horaire_fin"
            type="time"
            required
            value={formData.horaire_fin || ""}
            onChange={(e) => setFormData({ ...formData, horaire_fin: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-1" htmlFor="capacite">
          Capacité maximale
          <span className="text-red-500">*</span>
        </Label>
        <Input
          id="capacite"
          type="number"
          required
          min={1}
          value={formData.capacite || ""}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10) || 0;
            setFormData({ ...formData, capacite: value > 0 ? value : undefined });
          }}
        />
      </div>

      {onNext && (
        <div className="flex justify-end border-t pt-4">
          <Button 
            onClick={onNext}
            disabled={!isFormValid}
            className={`${!isFormValid ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/90"}`}
            size="lg"
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
}

export default CastleSelection;