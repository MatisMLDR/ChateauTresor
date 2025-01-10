import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const idAvis = params.id;

  if (!idAvis || isNaN(Number(idAvis))) {
    return NextResponse.json(
      { error: 'Paramètre id_avis invalide ou manquant' },
      { status: 400 }
    );
  }

  try {
    // Requête pour récupérer l'avis par son id
    const { data, error } = await supabase
      .from('avis')
      .select('*')
      .eq('id_avis', parseInt(idAvis, 10))
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération de l\'avis', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { message: `Aucun avis trouvé avec l'id ${idAvis}` },
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