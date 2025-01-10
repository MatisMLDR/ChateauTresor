"use client";

import { CreateHuntForm } from "@/components/organisateurs/create/create-hunt-form";
import { contenuTextuel } from "@/lib/contenuCreationChasse";
import { SideBarHuntCreator } from '@/components/ui/SideBarHuntCreator';

export default function CreateHuntPage() {
  
  return (
    <div className="flex">
      <SideBarHuntCreator />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">{contenuTextuel.create.title}</h1>
          <CreateHuntForm />
        </div>
      </main>
    </div>
      );
      }