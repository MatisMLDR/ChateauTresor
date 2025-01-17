import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// GET : Récupérer une équipe par l'id d'un membre
export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const id_membre = searchParams.get('id_membre');

  if (!id_membre) {
    return NextResponse.json({ error: 'id_membre est requis' }, { status: 400 });
  }

  try {
    // Étape 1 : Récupérer l'id_equipe à partir de la table appartenance_equipe
    const { data: appartenanceData, error: appartenanceError } = await supabase
      .from('appartenance_equipe')
      .select('id_equipe')
      .eq('id_membre', id_membre)
      .single(); // On suppose qu'un membre n'appartient qu'à une seule équipe

    if (appartenanceError || !appartenanceData) {
      return NextResponse.json(
        { error: appartenanceError?.message || 'Membre non trouvé ou non associé à une équipe' },
        { status: 404 }
      );
    }

    const id_equipe = appartenanceData.id_equipe;

    // Étape 2 : Récupérer les informations de l'équipe à partir de la table equipe_organisatrice
    const { data: equipeData, error: equipeError } = await supabase
      .from('equipe_organisatrice')
      .select('*')
      .eq('id_equipe', id_equipe)
      .single(); // On suppose qu'il n'y a qu'une seule équipe correspondante

    if (equipeError || !equipeData) {
      return NextResponse.json(
        { error: equipeError?.message || 'Équipe non trouvée' },
        { status: 404 }
      );
    }

    // Retourner les informations de l'équipe
    return NextResponse.json(equipeData, { status: 200 });
  } catch (err) {
    console.error('Erreur serveur :', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}