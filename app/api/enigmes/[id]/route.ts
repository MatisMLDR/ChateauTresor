import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// Récupérer une énigme par ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {id:enigmeId} = await params

  try {
    const { data, error } = await supabase.from('enigme').select('*').eq('id_enigme', enigmeId).single();
    if (error) {
      return NextResponse.json({ error: 'Erreur lors de la récupération de l\'énigme', details: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Une erreur est survenue', details: err }, { status: 500 });
  }
}

// Mettre à jour une énigme par ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {id:enigmeId} = await params
  const body = await request.json();

  try {
    const { error } = await supabase.from('enigme').update(body).eq('id_enigme', enigmeId);
    if (error) {
      return NextResponse.json({ error: 'Erreur lors de la mise à jour de l\'énigme', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Énigme mise à jour avec succès' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Une erreur est survenue', details: err }, { status: 500 });
  }
}

// Supprimer une énigme par ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {id:enigmeId} = await params

  try {
    const { error } = await supabase.from('enigme').delete().eq('id_enigme', enigmeId);
    if (error) {
      return NextResponse.json({ error: 'Erreur lors de la suppression de l\'énigme', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Énigme supprimée avec succès' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Une erreur est survenue', details: err }, { status: 500 });
  }
}