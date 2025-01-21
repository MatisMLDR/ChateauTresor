import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createClient();

  try {
    // Récupérer les données du corps de la requête
    const body = await request.json();
    const { id_chasse, score } = body;

    // Vérification des paramètres
    if (!id_chasse || score === undefined) {
      return NextResponse.json(
        { error: 'Paramètres id_chasse ou score invalides ou manquants' },
        { status: 400 }
      );
    }

    // Requête pour récupérer les récompenses
    const { data, error } = await supabase
      .from('recompense')
      .select('*')
      .eq('id_chasse', id_chasse)
      .lte('valeur', score);

    // Gestion des erreurs Supabase
    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des récompenses', details: error.message },
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