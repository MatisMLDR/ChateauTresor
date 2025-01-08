import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// Récupérer toutes les énigmes
export async function GET() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.from('enigme').select('*');
    if (error) {
      return NextResponse.json({ error: 'Erreur lors de la récupération des énigmes', details: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Une erreur est survenue', details: err }, { status: 500 });
  }
}

// Ajouter une nouvelle énigme
export async function POST(request: Request) {
  const supabase = createClient();
  const body = await request.json();

  try {
    const { error } = await supabase.from('enigme').insert([body]);
    if (error) {
      return NextResponse.json({ error: 'Erreur lors de l\'ajout de l\'énigme', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Énigme ajoutée avec succès' }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Une erreur est survenue', details: err }, { status: 500 });
  }
}