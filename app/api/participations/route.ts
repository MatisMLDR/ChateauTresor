import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const idParticipant = searchParams.get('id_participant');
  const idChasse = searchParams.get('id_chasse');

  if (!idParticipant) {
    return NextResponse.json(
      { error: 'Paramètre id_participant requis' },
      { status: 400 }
    );
  }

  try {
    // Récupération de toutes les participations correspondantes
    const { data: participations, error } = await supabase
      .from('participation')
      .select('*')
      .eq('id_participant', idParticipant)
      .eq('id_chasse', idChasse);

    if (error) throw error;

    // Si aucune participation trouvée
    if (!participations?.length) {
      return NextResponse.json(
        { message: 'Aucune participation trouvée' },
        { status: 404 }
      );
    }

    // Tri par proximité de date
    const now = new Date().getTime();
    const closestParticipation = participations.reduce((prev, current) => {
      const prevDiff = Math.abs(new Date(prev.date).getTime() - now);
      const currentDiff = Math.abs(new Date(current.date).getTime() - now);
      return currentDiff < prevDiff ? current : prev;
    });

    return NextResponse.json(closestParticipation, { status: 200 });

  } catch (err) {
    console.error('Erreur:', err);
    return NextResponse.json(
      { error: 'Erreur de traitement', details: String(err) },
      { status: 500 }
    );
  }
}