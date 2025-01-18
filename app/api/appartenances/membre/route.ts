import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// POST : Créer un nouveau membre
export async function POST(request: Request) {
  const supabase = createClient();
  try {
    const body = await request.json();
    const { data, error } = await supabase.from('appartenance_equipe').insert(body).select('*').single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE : Supprimer une appartenance
// TODO : A compléter

// GET : Récupérer une appartenance par son id
export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const id_membre = searchParams.get('id_membre');

  if (!id_membre) {
    return NextResponse.json({ error: 'id_membre est requis' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase.from('appartenance_equipe').select('*').eq('id_membre', id_membre);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}