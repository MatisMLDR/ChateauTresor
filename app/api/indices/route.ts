import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// Récupérer tous les indices
export async function GET() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.from('indice').select('*');
    if (error) {
      return NextResponse.json({ error: 'Erreur lors de la récupération des indices', details: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Une erreur est survenue', details: err }, { status: 500 });
  }
}

// Ajouter un nouvel indice
export async function POST(request: Request) {
  const supabase = createClient();
  const body = await request.json();

  try {
    const { error } = await supabase.from('indice').insert([body]);
    if (error) {
      return NextResponse.json({ error: 'Erreur lors de l\'ajout de l\'indice', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Indice ajouté avec succès' }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Une erreur est survenue', details: err }, { status: 500 });
  }
}