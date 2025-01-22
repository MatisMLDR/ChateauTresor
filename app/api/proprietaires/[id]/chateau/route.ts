import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// GET : Récupérer un Chateau par son proprietaire
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {id:id_proprietaire} = await params;

  try {
    const { data, error } = await supabase.from('chateau').select('*').eq('id_proprietaire', id_proprietaire).single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}