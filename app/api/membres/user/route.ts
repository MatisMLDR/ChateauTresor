import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// GET : Récupérer un membre par son id_user
export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const id_user = searchParams.get('id_user');

  if (!id_user) {
    return NextResponse.json({ error: 'id_user est requis' }, { status: 400 });
  }

  try {
    // Étape 1 : Récupérer le membre à partir de la table membre_equipe
    const { data: membreData, error: membreError } = await supabase
      .from('membre_equipe')
      .select('*')
      .eq('id_user', id_user)
      .single(); // On suppose qu'un id_user correspond à un seul membre


    // Retourner les informations du membre
    return NextResponse.json(membreData, { status: 200 });
  } catch (err) {
    console.error('Erreur serveur :', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}