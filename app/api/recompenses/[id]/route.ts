import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const idRecompense = params.id;

  try {
    const { data, error } = await supabase.from('recompense').select('*').eq('id_recompense', idRecompense).single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ message: `Récompense avec ID ${idRecompense} non trouvée` }, { status: 404 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const idRecompense = params.id;

  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from('recompense')
      .update(body)
      .eq('id_recompense', idRecompense)
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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const idRecompense = params.id;

  try {
    const { error } = await supabase.from('recompense').delete().eq('id_recompense', idRecompense);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: `Récompense avec ID ${idRecompense} supprimée avec succès` }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}