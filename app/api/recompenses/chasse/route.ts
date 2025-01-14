import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const idChasse = searchParams.get('id_chasse');

  // Vérification du paramètre
  if (!idChasse) {
    return NextResponse.json(
      { error: 'Paramètre id_chasse invalide ou manquant' },
      { status: 400 }
    );
  }

  try {
    // Requête pour récupérer les récompenses
    const { data, error } = await supabase
      .from('recompense')
      .select('*')
      .eq('id_chasse', idChasse);

    // Gestion des erreurs Supabase
    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des récompenses', details: error.message },
        { status: 500 }
      );
    }

    // Aucune récompense trouvée
    if (!data || data.length === 0) {
      return NextResponse.json(
        { message: `Aucune récompense trouvée pour la chasse avec id ${idChasse}` },
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