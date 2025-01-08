import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const idChasse = searchParams.get('id_chasse');

  // Vérification du paramètre
  if (!idChasse || isNaN(Number(idChasse))) {
    return NextResponse.json(
      { error: 'Paramètre id_chasse invalide ou manquant' },
      { status: 400 }
    );
  }

  try {
    // Récupérer toutes les énigmes pour la chasse donnée
    const { data: enigmes, error: enigmesError } = await supabase
      .from('enigme')
      .select('id_enigme')
      .eq('id_chasse', parseInt(idChasse, 10));

    if (enigmesError) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des énigmes', details: enigmesError.message },
        { status: 500 }
      );
    }

    if (!enigmes || enigmes.length === 0) {
      return NextResponse.json(
        { message: `Aucune énigme trouvée pour la chasse avec id ${idChasse}` },
        { status: 404 }
      );
    }

    // Extraire les ids des énigmes
    const enigmeIds = enigmes.map((enigme) => enigme.id_enigme);

    // Récupérer tous les indices associés aux énigmes
    const { data: indices, error: indicesError } = await supabase
      .from('indice')
      .select('*')
      .in('id_enigme', enigmeIds);

    if (indicesError) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des indices', details: indicesError.message },
        { status: 500 }
      );
    }

    if (!indices || indices.length === 0) {
      return NextResponse.json(
        { message: `Aucun indice trouvé pour les énigmes de la chasse avec id ${idChasse}` },
        { status: 404 }
      );
    }

    return NextResponse.json(indices, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du traitement de la requête', details: String(err) },
      { status: 500 }
    );
  }
}