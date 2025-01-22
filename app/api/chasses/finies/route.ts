import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();

  try {
    // Récupérer toutes les chasses terminées
    const { data, error } = await supabase
      .from('chasse')
      .select('*')
      .eq('statut', 'Finie');

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des chasses non terminées', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des chasses non terminées', details: String(err) },
      { status: 500 }
    );
  }
}