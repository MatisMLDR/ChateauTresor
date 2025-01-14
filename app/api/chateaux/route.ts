import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.from('chateau').select('*');

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des châteaux', details: error.message },
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

export async function POST(request: Request) {
  const supabase = createClient();

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('chateau')
      .insert(body)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la création du château', details: error.message },
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