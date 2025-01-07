import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    const url = new URL(request.url);
    const id_chateau = url.searchParams.get('id_chateau');

    let query = supabase
      .from('chasse')
      .select(
        'id_chasse, titre, description, image, difficulte, prix, date_debut, date_fin'
      );

    if (id_chateau) {
      query = query.eq('id_chateau', id_chateau);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des chasses', details: error.message },
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