import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// GET: Récupérer le nombre de chasses terminées pour un participant
export async function GET(request: Request) {
  const supabase = createClient();
  try {
  const { data, error } = await supabase
  .from('participants')
  .select(`
    id_participant,
    id_user,
    participations!inner(
      est_terminee
    )
  `)
  .filter('participations.est_terminee', 'eq', true);

  if (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du nombre de chasses terminées', details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 200 });

  } catch (err) {
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération du participant', details: String(err) },
      { status: 500 }
    );
  }
}