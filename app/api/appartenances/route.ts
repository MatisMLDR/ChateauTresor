import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// GET : Récupére l'intégralité des appartenances
export async function GET(request: Request) {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.from('appartenance_equipe').select('*');
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

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