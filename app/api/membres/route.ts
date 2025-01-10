import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// GET : Récupérer tous les membres
export async function GET() {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.from('membre_equipe').select('*');
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST : Créer un nouveau membre
export async function POST(request: Request) {
  const supabase = createClient();
  try {
    const body = await request.json();
    const { data, error } = await supabase.from('membre_equipe').insert(body).select('*').single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}