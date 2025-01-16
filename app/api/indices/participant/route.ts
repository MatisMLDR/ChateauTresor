import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  const supabase = createClient();

  try {
    const body = await request.json();
    const { id_indice, id_participant } = body;

    // Log des données reçues
    console.log('Données reçues:', { id_indice, id_participant });

    // Validation des champs obligatoires
    if (!id_indice || !id_participant) {
      return NextResponse.json(
        { error: 'Les champs id_indice et id_participant sont obligatoires' },
        { status: 400 }
      );
    }

    // Insérer un nouvel enregistrement dans la table Indice_Participant
    const { data, error } = await supabase
      .from('indice_participant')
      .insert([{ id_indice, id_participant, est_decouvert: true, date_utilisation: new Date().toISOString() }])
      .select(); // Ajoutez .select() pour voir les données insérées

    if (error) {
      console.error('Erreur Supabase:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: 'Erreur lors de l\'insertion de l\'enregistrement', details: error.message },
        { status: 500 }
      );
    }

    // Log des données insérées
    console.log('Données insérées:', data);

    return NextResponse.json(
      { message: 'Enregistrement inséré avec succès', data },
      { status: 200 }
    );
  } catch (err) {
    console.error('Erreur inattendue:', err);
    return NextResponse.json(
      { error: 'Une erreur est survenue', details: String(err) },
      { status: 500 }
    );
  }
}