import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// Récupérer toutes les demandes d'appartenance pour une équipe
export async function GET(request: Request) {
  const supabase = createClient();

  const { searchParams } = new URL(request.url);
  const id_equipe = searchParams.get('id_equipe');

  if (!id_equipe) {
    return NextResponse.json({ error: 'id_equipe est requis' }, { status: 400 });
  }
  try {
    // Récupérer toutes les équipes organisatrices
    const { data, error } = await supabase
      .from('vue_demandes_appartenance_equipe')
      .select('*')
      .eq('id_equipe', id_equipe);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}