import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const idChasse = searchParams.get('id_chasse');
  const date = searchParams.get('date');

  // Vérification du paramètre id_chasse
  if (!idChasse) {
    return NextResponse.json(
      { error: 'Paramètre id_chasse invalide ou manquant' },
      { status: 400 }
    );
  }

  try {
    // Requête pour compter les participations
    const { count, error } = await supabase
      .from('participation')
      .select('*', { count: 'exact' }) // Utilisation de l'option count pour obtenir le nombre de lignes
      .eq('id_chasse', idChasse)
      .eq('jour', date);

    // Gestion des erreurs Supabase
    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des participations', details: error.message },
        { status: 500 }
      );
    }

    // Réponse avec le nombre de participations
    return NextResponse.json({ count }, { status: 200 });
  } catch (err) {
    // Gestion des erreurs inattendues
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du traitement de la requête', details: String(err) },
      { status: 500 }
    );
  }
}