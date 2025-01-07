import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idChateau = searchParams.get('id_chateau'); // Récupération du paramètre id_chateau

    if (!idChateau) {
      return NextResponse.json(
        { error: 'id_chateau est requis pour récupérer les chasses' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Récupération des chasses liées au château
    const { data, error } = await supabase
      .from('chasse')
      .select('id_chasse, titre, description, date_debut, date_fin, difficulte, prix, theme, statut, image')
      .eq('id_chateau', idChateau);

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des chasses', details: error.message },
        { status: 500 }
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