import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// GET : Récupérer un proprietaire par son id_user
export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const id_user = searchParams.get('id_user');

  if (!id_user) {
    return NextResponse.json({ error: 'id_user est requis' }, { status: 400 });
  }

  try {
    const { data: proprietaireData } = await supabase
      .from('proprietaire_chateau')
      .select('*')
      .eq('id_user', id_user)
      .single(); 

    // Retourner les informations du proprietaire
    return NextResponse.json(proprietaireData, { status: 200 });
  } catch (err) {
    console.error('Erreur serveur :', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}