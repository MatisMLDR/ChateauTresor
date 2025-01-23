import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const idParticipant = searchParams.get('id_participant');

  // Vérification du paramètre
  if (!idParticipant) {
    return NextResponse.json(
      { error: 'Paramètre id_participant invalide ou manquant' },
      { status: 400 }
    );
  }

  try {
    // Requête pour récupérer les participations
    const { data, error } = await supabase
      .from('participation')
      .select('*')
      .eq('id_participant', idParticipant);

    // Gestion des erreurs Supabase
    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des participations', details: error.message },
        { status: 500 }
      );
    }

    // Réponse avec les données
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    // Gestion des erreurs inattendues
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du traitement de la requête', details: String(err) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const supabase = createClient();

  try {

    const body = await request.json();
    console.log(body);
    // Vérification des paramètres
    if (!body.id_participant || !body.id_chasse || !body.jour || !body.score) {
      return NextResponse.json(
        { error: 'Paramètre id_participant, jour ou id_chasse invalide ou manquant' },
        { status: 400 }
      ); 
    }

    // Création de la participation
    const {error} = await supabase
      .from('participation')
      .insert(body);

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la création de la participation', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Participation créée avec succès' }, {
      status: 200
    });

  } catch (err) {
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des données', details: String(err) },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const supabase = createClient();

  try {
    const body = await request.json();
    const { id_participant, id_chasse, ...updates } = body;

    // Vérification des paramètres obligatoires
    if (!id_participant || !id_chasse) {
      return NextResponse.json(
        { error: 'Paramètre id_participant ou id_chasse invalide ou manquant' },
        { status: 400 }
      );
    }

    // Mise à jour des attributs spécifiés
    const { data, error } = await supabase
      .from('participation')
      .update(updates)
      .eq('id_participant', id_participant)
      .eq('id_chasse', id_chasse)
      .select();

    // Gestion des erreurs Supabase
    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour de la participation', details: error.message },
        { status: 500 }
      );
    }

    // Réponse avec les données mises à jour
    return NextResponse.json(data[0], { status: 200 });
  } catch (err) {
    // Gestion des erreurs inattendues
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du traitement de la requête', details: String(err) },
      { status: 500 }
    );
  }
}
