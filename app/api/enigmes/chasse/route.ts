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
    // Récupérer toutes les énigmes pour la chasse donnée
    const { data, error } = await supabase
      .from('enigme')
      .select('*')
      .eq('id_chasse', idChasse);

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des énigmes', details: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { message: `Aucune énigme trouvée pour la chasse avec id ${idChasse}` },
        { status: 404 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du traitement de la requête', details: String(err) },
      { status: 500 }
    );
  }
}