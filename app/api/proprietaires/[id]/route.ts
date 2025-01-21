import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// GET : Récupérer un Proprietaire spécifique
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const id_proprietaire = await params.id;

  try {
    const { data, error } = await supabase.from('proprietaire_chateau').select('*').eq('id_proprietaire', id_proprietaire).single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT : Mettre à jour un Proprietaire spécifique
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const id_proprietaire = params.id;

  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from('proprietaire_chateau')
      .update(body)
      .eq('id_proprietaire', id_proprietaire)
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

// DELETE : Supprimer un Proprietaire spécifique
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const id_proprietaire = params.id;

  try {
    const { error } = await supabase.from('proprietaire_chateau').delete().eq('id_proprietaire', id_proprietaire);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Proprietaire supprimé avec succès' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}