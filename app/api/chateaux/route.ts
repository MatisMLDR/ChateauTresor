import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('chateau')
      .select('id_chateau, nom, localisation, description, image');

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des châteaux', details: error.message },
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