import Chasse from '@/classes/Chasse';
import ClassementGeneralPoints from '@/components/global/ClassementGeneralPoints';
import { LoaderCircle } from 'lucide-react';
import React from 'react'

const ClassementsOfChasse = async ({ params }: { params: { id: any } }) => {
  const { id } = await params;

  const chasse = await Chasse.readId(id);

  if (!chasse) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="mb-8 text-3xl font-bold">Classements de la chasse {chasse.getTitre()}</h1>
      <ClassementGeneralPoints id_chasse={id} />
    </div>
  );
};

export default ClassementsOfChasse
