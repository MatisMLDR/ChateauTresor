import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const idChasse = searchParams.get('id_chasse');

  // Validation du paramètre id_chasse
  if (!idChasse || typeof idChasse !== 'string') {
    return NextResponse.json(
      { error: 'Paramètre id_chasse invalide ou manquant' },
      { status: 400 }
    );
  }

  try {
    // Requête pour récupérer les avis
    const { data, error } = await supabase
      .from('avis')
      .select('*')
      .eq('id_chasse', idChasse);

    // Gestion des erreurs Supabase
    if (error) {
      console.error('Erreur Supabase:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des avis', details: error.message },
        { status: 500 }
      );
    }

    // Réponse avec les données
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    // Gestion des erreurs inattendues
    console.error('Erreur inattendue:', err);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du traitement de la requête', details: String(err) },
      { status: 500 }
    );
  }
}