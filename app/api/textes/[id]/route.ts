import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// Récupérer un texte par son ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  try {
    const idTexte = parseInt(params.id, 10);
    if (isNaN(idTexte)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    const { data, error } = await supabase.from('texte').select('*').eq('id_texte', idTexte).single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: 'Texte introuvable' }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Mettre à jour un texte
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  try {
    const idTexte = parseInt(params.id, 10);
    if (isNaN(idTexte)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    const body = await req.json();
    const { data, error } = await supabase.from('texte').update(body).eq('id_texte', idTexte).select('*').single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Supprimer un texte
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  try {
    const idTexte = parseInt(params.id, 10);
    if (isNaN(idTexte)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    const { error } = await supabase.from('texte').delete().eq('id_texte', idTexte);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Texte supprimé avec succès' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}