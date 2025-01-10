import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// GET: Récupérer un participant par ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const idParticipant = params.id;

  if (!idParticipant || isNaN(Number(idParticipant))) {
    return NextResponse.json(
      { error: 'Paramètre id_participant invalide ou manquant' },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('id_participant', parseInt(idParticipant, 10))
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération du participant', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { message: `Aucun participant trouvé avec l'ID ${idParticipant}` },
        { status: 404 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération du participant', details: String(err) },
      { status: 500 }
    );
  }
}

// PUT: Mettre à jour un participant par ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const idParticipant = params.id;

  if (!idParticipant || isNaN(Number(idParticipant))) {
    return NextResponse.json(
      { error: 'Paramètre id_participant invalide ou manquant' },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();

    const { error } = await supabase
      .from('participants')
      .update(body)
      .eq('id_participant', parseInt(idParticipant, 10));

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du participant', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Participant mis à jour avec succès' }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la mise à jour du participant', details: String(err) },
      { status: 500 }
    );
  }
}

// DELETE: Supprimer un participant par ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const idParticipant = params.id;

  if (!idParticipant || isNaN(Number(idParticipant))) {
    return NextResponse.json(
      { error: 'Paramètre id_participant invalide ou manquant' },
      { status: 400 }
    );
  }

  try {
    const { error } = await supabase
      .from('participants')
      .delete()
      .eq('id_participant', parseInt(idParticipant, 10));

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la suppression du participant', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Participant supprimé avec succès' }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la suppression du participant', details: String(err) },
      { status: 500 }
    );
  }
}