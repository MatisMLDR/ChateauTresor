import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// GET : Récupére l'appartenance d'un membre à une équipe
export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const id_membre = searchParams.get('id_membre');
  const id_equipe = searchParams.get('id_equipe');

  if (!id_membre || !id_equipe) {
    return NextResponse.json({ error: 'id_membre et id_equipe sont requis' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('appartenance_equipe')
      .select('*')
      .eq('id_membre', id_membre)
      .eq('id_equipe', id_equipe)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE : Supprimer une appartenance
export async function DELETE(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const id_membre = searchParams.get('id_membre');
  const id_equipe = searchParams.get('id_equipe');

  if (!id_membre || !id_equipe) {
    return NextResponse.json({ error: 'id_membre et id_equipe sont requis' }, { status: 400 });
  }

  try {
    const { error } = await supabase
      .from('appartenance_equipe')
      .delete()
      .eq('id_membre', id_membre)
      .eq('id_equipe', id_equipe);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Appartenance supprimée' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}