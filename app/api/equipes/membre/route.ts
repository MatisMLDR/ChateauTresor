import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// GET : Récupérer toutes les équipes d'un membre par son id
export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const id_membre = searchParams.get('id_membre');

  // Vérification du paramètre
  if (!id_membre) {
    return NextResponse.json({ error: 'id_membre est requis' }, { status: 400 });
  }

  try {
    // Étape 1 : Récupérer tous les id_equipe associés au membre
    const { data: appartenanceData, error: appartenanceError } = await supabase
      .from('appartenance_equipe')
      .select('id_equipe')
      .eq('id_membre', id_membre);

    // Gestion des erreurs
    if (appartenanceError) {
      return NextResponse.json(
        { error: appartenanceError.message || 'Erreur lors de la récupération des équipes du membre' },
        { status: 500 }
      );
    }

    // Extraire les id_equipe
    const id_equipes = appartenanceData.map((row) => row.id_equipe);

    // Étape 2 : Récupérer les informations de toutes les équipes associées
    const { data: equipeData, error: equipeError } = await supabase
      .from('equipe_organisatrice')
      .select('*')
      .in('id_equipe', id_equipes); // Utilisation de `in` pour récupérer plusieurs équipes

    // Gestion des erreurs
    if (equipeError) {
      return NextResponse.json(
        { error: equipeError.message || 'Erreur lors de la récupération des informations des équipes' },
        { status: 500 }
      );
    }

    // Retourner les informations des équipes
    return NextResponse.json(equipeData, { status: 200 });
  } catch (err) {
    console.error('Erreur serveur :', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}