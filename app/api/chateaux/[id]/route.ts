import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();

  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: 'L’identifiant du château est requis' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('chateau')
      .select('*')
      .eq('id_chateau', id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération du château', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération', details: String(err) },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();

  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: 'L’identifiant du château est requis' },
        { status: 400 }
      );
    }

    const body = await request.json();

    const { error } = await supabase
      .from('chateau')
      .update(body)
      .eq('id_chateau', id);

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du château', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Château mis à jour avec succès' }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la mise à jour', details: String(err) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();

  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: 'L’identifiant du château est requis' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('chateau')
      .delete()
      .eq('id_chateau', id);

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la suppression du château', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Château supprimé avec succès' }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la suppression', details: String(err) },
      { status: 500 }
    );
  }
}