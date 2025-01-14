import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const idChasse = searchParams.get('id_chasse');

  // Vérification du paramètre id_chasse
  if (!idChasse) {
    return NextResponse.json(
      { error: 'Paramètre id_chasse invalide ou manquant' },
      { status: 400 }
    );
  }

  try {
    // Étape 1 : Récupérer les participations pour une chasse donnée
    const { data: participations, error: participationsError } = await supabase
      .from('participation')
      .select('id_participant')
      .eq('id_chasse', idChasse);

    if (participationsError) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des participations', details: participationsError.message },
        { status: 500 }
      );
    }

    if (!participations || participations.length === 0) {
      return NextResponse.json(
        { message: `Aucun participant trouvé pour la chasse avec id ${idChasse}` },
        { status: 404 }
      );
    }

    // Étape 2 : Récupérer les informations des participants à partir de la table participant
    const participantIds = participations.map((p) => p.id_participant);
    const { data: participants, error: participantsError } = await supabase
      .from('participant')
      .select('id_participant, nb_participations, nb_chasses_terminees, score_moyen, duree_moyenne')
      .in('id_participant', participantIds);

    if (participantsError) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des participants', details: participantsError.message },
        { status: 500 }
      );
    }

    // Réponse avec les données des participants
    return NextResponse.json(participants, { status: 200 });
  } catch (err) {
    // Gestion des erreurs inattendues
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du traitement de la requête', details: String(err) },
      { status: 500 }
    );
  }
}