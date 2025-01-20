import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const idChasse = searchParams.get('id_chasse');

  // Vérification du paramètre
  if (!idChasse) {
    return NextResponse.json(
      { error: 'Paramètre id_chasse manquant' },
      { status: 400 }
    );
  }

  console.log('idChasse:', idChasse); // Log pour déboguer

  try {
    // Récupérer toutes les énigmes pour la chasse donnée
    const { data, error } = await supabase
      .from('enigme') // Assurez-vous que c'est le bon nom de table
      .select('*')
      .eq('id_chasse', idChasse); // Pas besoin de parseInt pour un UUID

    console.log('Réponse Supabase:', { data, error }); // Log pour déboguer

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des énigmes', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('Erreur dans l\'API:', err); // Log pour déboguer
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du traitement de la requête', details: String(err) },
      { status: 500 }
    );
  }
}