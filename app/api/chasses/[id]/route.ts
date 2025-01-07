import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: 'L’identifiant de la chasse est requis' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('chasse')
      .select(
        'id_chasse, titre, description, image, difficulte, prix, date_debut, date_fin'
      )
      .eq('id_chasse', id)
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
      { error: 'Une erreur est survenue', details: String(err) },
      { status: 500 }
    );
  }
}