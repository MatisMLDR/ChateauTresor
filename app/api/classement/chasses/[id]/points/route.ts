import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { id } = await params

  try {
    const { data, error } = await supabase
      .from('participation')
      .select(`
        score,
        participant (
          id_participant,
          id_user,
          profiles:profiles!id_user (
            nom,
            prenom,
            username,
            ville
          )
        )
      `)
      .eq('id_chasse', id)
      .eq('est_terminee', true)
      .order('score', { ascending: false });

    if (error) throw error;

    // Formatter les données
    const formattedData = data
      .filter(participation => participation.Participant?.profiles) // Filtrer les participations invalides
      .map(participation => ({
        id_participant: participation.Participant?.id_participant,
        id_user: participation.Participant?.id_user,
        nom: participation.Participant?.profiles?.nom,
        prenom: participation.Participant?.profiles?.prenom,
        username: participation.Participant?.profiles?.username,
        ville: participation.Participant?.profiles?.ville,
        score: participation.score
      }));

    return NextResponse.json(formattedData, { status: 200 });

  } catch (err) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du classement', details: String(err) },
      { status: 500 }
    );
  }
}