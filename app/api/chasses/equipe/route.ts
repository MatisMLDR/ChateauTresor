import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const idEquipe = searchParams.get('id_equipe');

  // Vérification du paramètre
  if (!idEquipe) {
    return NextResponse.json(
      { error: 'Paramètre id_equipe invalide ou manquant' },
      { status: 400 }
    );
  }

  try {
    // Requête pour récupérer les chasses associées à une équipe
    const { data, error } = await supabase
      .from('chasse')
      .select('*')
      .eq('id_equipe', idEquipe);

    // Gestion des erreurs Supabase
    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des chasses', details: error.message },
        { status: 500 }
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