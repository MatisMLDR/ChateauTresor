import { createClient } from '@/utils/supabase/server';
import { UUID } from 'crypto';
import { NextResponse } from 'next/server';

// GET: Récupérer un participant par ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: UUID }> }
) {
  const supabase = createClient();
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: 'Paramètre id_user invalide ou manquant' },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from('participant')
      .select('*')
      .eq('id_user', id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération du participant', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { message: `Aucun participant trouvé avec l'ID ${id}` },
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
