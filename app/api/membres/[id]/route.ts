import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// GET : Récupérer un membre spécifique
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {id:id_membre} = await params


  try {
    const { data, error } = await supabase.from('membre_equipe').select('*').eq('id_membre', id_membre).single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT : Mettre à jour un membre spécifique
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {id:id_membre} = await params


  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from('membre_equipe')
      .update(body)
      .eq('id_membre', id_membre)
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

// DELETE : Supprimer un membre spécifique
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {id:id_membre} = await params


  try {
    const { error } = await supabase.from('membre_equipe').delete().eq('id_membre', id_membre);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Membre supprimé avec succès' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}