import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const chasseId = params.id;

  try {
    const { data, error } = await supabase
      .from('chasse')
      .select('*')
      .eq('id_chasse', chasseId)
      .single(); // Retourne un seul résultat

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération de la chasse', details: error.message },
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