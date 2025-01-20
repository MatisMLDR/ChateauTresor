"use client";

import { CreateHuntForm } from "@/components/organisateurs/create/create-hunt-form";
import { contenuTextuel } from "@/constants";
import { useRouter } from "next/navigation"; // Importez useRouter pour la redirection

export default function CreateHuntPage() {
  const router = useRouter(); // Initialisez useRouter

  // Fonction pour gérer la redirection après la création d'une chasse
  const handleHuntCreated = (id_equipe: string) => {
    // Redirigez l'utilisateur vers la page du tableau de bord des chasses
    router.push(`/organisateurs/dashboard/${id_equipe}/chasses`);
  };

  return (
    <div className="flex">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">{contenuTextuel.create.title}</h1>
          {/* Passez la fonction de redirection en tant que prop à CreateHuntForm */}
          <CreateHuntForm onHuntCreated={handleHuntCreated} />
        </div>
      </main>
    </div>
  );
}