import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } } // Récupérer l'id_proprietaire depuis les paramètres dynamiques
) {
  const supabase = createClient();

  try {
    // Récupérer l'id_proprietaire depuis les paramètres dynamiques
    const id_proprietaire = params.id; // Pas besoin de await ici, car params.id est synchrone

    if (!id_proprietaire) {
      return NextResponse.json(
        { error: 'Le paramètre id_proprietaire est manquant' },
        { status: 400 }
      );
    }

    // Récupérer tous les châteaux associés à l'id_proprietaire
    const { data: chateaux, error: chateauError } = await supabase
      .from('chateau')
      .select('id_chateau')
      .eq('id_proprietaire', id_proprietaire);

    if (chateauError || !chateaux || chateaux.length === 0) {
      console.error('Erreur lors de la récupération des châteaux:', chateauError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des châteaux', details: chateauError?.message },
        { status: 500 }
      );
    }

    // Récupérer les IDs des châteaux
    const chateauIds = chateaux.map((chateau) => chateau.id_chateau);

    // Récupérer les chasses en cours de validation pour ces châteaux
    const { data: chasses, error: chassesError } = await supabase
      .from('chasse')
      .select('*')
      .in('id_chateau', chateauIds) // Utiliser .in() pour filtrer par plusieurs IDs de châteaux
      .eq('statut', 'En attente de validation');

    if (chassesError) {
      console.error('Erreur lors de la récupération des chasses:', chassesError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des chasses', details: chassesError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(chasses, { status: 200 });
  } catch (err) {
    console.error('Erreur GET:', err);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du traitement de la requête', details: (err as Error).message },
      { status: 500 }
    );
  }
}