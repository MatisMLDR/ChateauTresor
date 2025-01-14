import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// Récupérer un indice par ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const indiceId = params.id;

  try {
    const { data, error } = await supabase.from('indice').select('*').eq('id_indice', indiceId).single();
    if (error) {
      return NextResponse.json({ error: 'Erreur lors de la récupération de l\'indice', details: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Une erreur est survenue', details: err }, { status: 500 });
  }
}

// Mettre à jour un indice par ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const indiceId = params.id;
  const body = await request.json();

  try {
    const { error } = await supabase.from('indice').update(body).eq('id_indice', indiceId);
    if (error) {
      return NextResponse.json({ error: 'Erreur lors de la mise à jour de l\'indice', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Indice mis à jour avec succès' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Une erreur est survenue', details: err }, { status: 500 });
  }
}

// Supprimer un indice par ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const indiceId = params.id;

  try {
    const { error } = await supabase.from('indice').delete().eq('id_indice', indiceId);
    if (error) {
      return NextResponse.json({ error: 'Erreur lors de la suppression de l\'indice', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Indice supprimé avec succès' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Une erreur est survenue', details: err }, { status: 500 });
  }
}