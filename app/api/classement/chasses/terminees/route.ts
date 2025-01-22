// app/api/classement/chasses/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('Participant')
      .select(`
        id_participant,
        id_user,
        profiles:profiles!id_user (
          nom,
          prenom,
          username,
          ville
        ),
        participations:Participation!id_participant (
          est_terminee
        )
      `)
      .filter('participations.est_terminee', 'eq', true);

    if (error) throw error;

    // Formater les données
    const formattedData = data.map(participant => ({
      id_participant: participant.id_participant,
      id_user: participant.id_user,
      nom: participant.profiles?.nom,
      prenom: participant.profiles?.prenom,
      username: participant.profiles?.username,
      ville: participant.profiles?.ville,
      nbChasses: participant.participations.length
    })).sort((a, b) => b.nbChasses - a.nbChasses);

    return NextResponse.json(formattedData, { status: 200 });

  } catch (err) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du classement', details: String(err) },
      { status: 500 }
    );
  }
}