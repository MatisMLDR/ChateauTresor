import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// GET: Récupérer toutes les participations
export async function GET() {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.from('participations').select('*');
    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des participants', details: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des participants', details: String(err) },
      { status: 500 }
    );
  }
}