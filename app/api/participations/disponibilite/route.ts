import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createClient();

  try {
    const { searchParams } = new URL(request.url);
    const id_chasse = searchParams.get('id_chasse');
    const jour = searchParams.get('jour');

    if (!id_chasse || !jour) {
      return NextResponse.json({ error: 'Paramètres id_chasse et jour manquants ou invalides' }, { status: 400 });
    }

    // Récupérer la capacité maximale de la chasse
    const { data: chasse, error: chasseError } = await supabase
      .from('chasse')
      .select('capacite')
      .eq('id_chasse', id_chasse)
      .single();

    if (chasseError || !chasse) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération de la chasse', details: chasseError?.message },
        { status: 500 }
      );
    }

    const capaciteMax = chasse.capacite;

    // Compter les participations pour cette chasse à la date donnée
    const { count: nombreParticipations, error: participationError } = await supabase
      .from('participation')
      .select('*', { count: 'exact', head: true })
      .eq('id_chasse', id_chasse)
      .eq('jour', jour);

    if (participationError) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des participations', details: participationError.message },
        { status: 500 }
      );
    }

    // Vérifier la disponibilité
    const disponible = (nombreParticipations ?? 0) < capaciteMax;

    return NextResponse.json({ disponible });
  } catch (err) {
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la vérification de la disponibilité', details: String(err) },
      { status: 500 }
    );
  }
}