import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const idParticipant = searchParams.get('id_participant');

  // Vérification du paramètre
  if (!idParticipant || isNaN(Number(idParticipant))) {
    return NextResponse.json(
      { error: 'Paramètre id_participant invalide ou manquant' },
      { status: 400 }
    );
  }

  try {
    // Requête pour récupérer les participations
    const { data, error } = await supabase
      .from('participation')
      .select('*')
      .eq('id_participant', parseInt(idParticipant, 10));

    // Gestion des erreurs Supabase
    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des participations', details: error.message },
        { status: 500 }
      );
    }

    // Aucune participation trouvée
    if (!data || data.length === 0) {
      return NextResponse.json(
        { message: `Aucune participation trouvée pour le participant avec id ${idParticipant}` },
        { status: 404 }
      );
    }

    // Réponse avec les données
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    // Gestion des erreurs inattendues
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du traitement de la requête', details: String(err) },
      { status: 500 }
    );
  }
}