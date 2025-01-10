import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const idParticipant = searchParams.get('id_participant');

  if (!idParticipant || isNaN(Number(idParticipant))) {
    return NextResponse.json(
      { error: 'Paramètre id_participant invalide ou manquant' },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from('avis')
      .select('*')
      .eq('id_participant', parseInt(idParticipant, 10));

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des avis', details: error.message },
        { status: 500 }
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