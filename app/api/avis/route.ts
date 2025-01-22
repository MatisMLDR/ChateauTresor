import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// GET : Récupérer tous les avis
export async function GET() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.from('avis').select('*');

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des avis', details: error.message },
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

// POST : Créer un avis
export async function POST(request: Request) {
  const supabase = createClient();

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('avis')
      .insert(body)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la création de l"avis', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la création', details: String(err) },
      { status: 500 }
    );
  }
}