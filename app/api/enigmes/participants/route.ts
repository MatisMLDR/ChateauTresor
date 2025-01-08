import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const idEnigme = searchParams.get('id_enigme');

  // Vérification du paramètre
  if (!idEnigme || isNaN(Number(idEnigme))) {
    return NextResponse.json(
      { error: 'Paramètre id_enigme invalide ou manquant' },
      { status: 400 }
    );
  }

  try {
    // Requête vers la table 'enigme_participant'
    const { data, error } = await supabase
      .from('enigme_participant')
      .select('*')
      .eq('id_enigme', parseInt(idEnigme, 10));

    // Vérification des erreurs de la requête
    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des données', details: error.message },
        { status: 500 }
      );
    }

    // Vérification si les données existent
    if (!data || data.length === 0) {
      return NextResponse.json(
        { message: `Aucune participation trouvée pour l'énigme avec l'id ${idEnigme}` },
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