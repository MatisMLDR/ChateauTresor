import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// GET: Récupérer une chasse par son ID
export async function GET(request: Request, { params }: { params: { id: number } }) {
  const supabase = createClient();

  try {
    const resolvedParams = await params;
    const chasseId = resolvedParams.id;
    
    if (!chasseId) {
      return NextResponse.json({ error: 'Paramètre id manquant ou invalide' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('chasse')
      .select('*')
      .eq('id_chasse', chasseId)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération de la chasse', details: error.message },
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

// PUT: Mettre à jour une chasse par son ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();

  try {
    const resolvedParams = await params;
    const chasseId = parseInt(resolvedParams.id);

    if (!chasseId) {
      return NextResponse.json({ error: 'Paramètre id manquant ou invalide' }, { status: 400 });
    }

    const body = await request.json();

    const { error } = await supabase
      .from('chasse')
      .update(body)
      .eq('id_chasse', chasseId);

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour de la chasse', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Chasse mise à jour avec succès' }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la mise à jour', details: String(err) },
      { status: 500 }
    );
  }
}

// DELETE: Supprimer une chasse par son ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();

  try {
    const resolvedParams = await params;
    const chasseId = parseInt(resolvedParams.id);

    if (!chasseId) {
      return NextResponse.json({ error: 'Paramètre id manquant ou invalide' }, { status: 400 });
    }

    const { error } = await supabase
      .from('chasse')
      .delete()
      .eq('id_chasse', chasseId);

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la suppression de la chasse', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Chasse supprimée avec succès' }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la suppression', details: String(err) },
      { status: 500 }
    );
  }
}