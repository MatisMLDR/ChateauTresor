import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// GET: Récupérer tous les participants
export async function GET() {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.from('participants').select('*');
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

// POST: Créer un nouveau participant
export async function POST(request: Request) {
  const supabase = createClient();
  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from('participant')
      .insert(body)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la création du participant', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la création du participant', details: String(err) },
      { status: 500 }
    );
  }
}