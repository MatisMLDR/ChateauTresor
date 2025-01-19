import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  const supabase = createClient();

  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from('appartenance_equipe')
      .update({ statut: 'Refusé'})
      .eq('id_equipe', body.id_equipe)
      .eq('id_membre', body.id_membre)
      .select('*')
      .single();
      
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}