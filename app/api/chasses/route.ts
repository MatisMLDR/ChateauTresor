import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// GET : Toutes les chasses ou les chasses d'un château spécifique
export async function GET(request: Request) {
  const supabase = createClient();
  const url = new URL(request.url);
  const chateauId = url.searchParams.get('chateauId'); // Filtre par id_chateau si fourni

  try {
    const query = supabase.from('chasse').select('*');
    if (chateauId) {
      query.eq('id_chateau', chateauId); // Ajoute un filtre si un château spécifique est demandé
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
      { error: 'Une erreur est survenue lors du traitement de la requête', details: String(err) },
      { status: 500 }
    );
  }
}