import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.from('chasse').select('*');

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des chasses', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du traitement de la requête', details: err },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const supabase = createClient();

  let body;
  try {
    body = await request.json();

    // Supprimer id_chasse si fourni accidentellement
    if ('id_chasse' in body) {
      delete body.id_chasse;
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON format in request body', details: (error as Error).message },
      { status: 400 }
    );
  }

  try {
    // Vérifier si le château existe
    const { data: chateau, error: chateauError } = await supabase
      .from('chateau')
      .select('*')
      .eq('id_chateau', body.id_chateau)
      .single();

    if (chateauError || !chateau) {
      return NextResponse.json(
        { error: `Château avec id_chateau=${body.id_chateau} introuvable` },
        { status: 404 }
      );
    }

    // Insérer la chasse
    const { error } = await supabase.from('chasse').insert([body]);

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de l\'insertion de la chasse', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Chasse insérée avec succès' }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du traitement de la requête', details: err },
      { status: 500 }
    );
  }
}
