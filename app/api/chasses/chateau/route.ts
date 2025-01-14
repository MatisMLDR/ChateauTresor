import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const idChateau = searchParams.get('id_chateau');

  if (!idChateau) {
    return NextResponse.json(
      { error: 'Paramètre id_chateau invalide ou manquant' },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from('chasse')
      .select('*')
      .eq('id_chateau', idChateau);

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des chasses', details: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { message: `Aucune chasse trouvée pour le château avec id ${idChateau}` },
        { status: 404 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du traitement de la requête', details: err },
      { status: 500 }
    );
  }
}