import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.from('chasse').select('*');

    if (error) {
      console.error('Erreur Supabase GET:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des chasses', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('Erreur GET:', err);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du traitement de la requête', details: (err as Error).message },
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

    // Validation de la structure des données
    if (!body.titre || typeof body.titre !== 'string') {
      return NextResponse.json(
        { error: 'Le champ "titre" est manquant ou invalide (doit être une chaîne de caractères)' },
        { status: 400 }
      );
    }

    if (!body.id_chateau || typeof body.id_chateau !== 'number') {
      return NextResponse.json(
        { error: 'Le champ "id_chateau" est manquant ou invalide (doit être un nombre)' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Erreur lors du parsing JSON:', error);
    return NextResponse.json(
      { error: 'Format JSON invalide dans le corps de la requête', details: (error as Error).message },
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

    if (chateauError) {
      console.error('Erreur lors de la vérification du château:', chateauError);
      return NextResponse.json(
        { error: `Erreur lors de la vérification du château avec id_chateau=${body.id_chateau}`, details: chateauError.message },
        { status: 500 }
      );
    }

    if (!chateau) {
      return NextResponse.json(
        { error: `Aucun château trouvé avec id_chateau=${body.id_chateau}` },
        { status: 404 }
      );
    }

    // Insérer la chasse
    const { error: insertError } = await supabase.from('chasse').insert([body]);

    if (insertError) {
      console.error('Erreur lors de l\'insertion de la chasse:', insertError);
      return NextResponse.json(
        { error: 'Erreur lors de l\'insertion de la chasse', details: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Chasse insérée avec succès' }, { status: 201 });
  } catch (err) {
    console.error('Erreur POST:', err);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du traitement de la requête', details: (err as Error).message },
      { status: 500 }
    );
  }
}