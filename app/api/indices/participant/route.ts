import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { NextApiRequest, NextApiResponse } from 'next';

export async function POST(request: Request) {
  const supabase = createClient();

  try {
    const body = await request.json();
    const { id_indice, id_participant } = body;

    // Log des données reçues
    console.log('Données reçues:', { id_indice, id_participant });

    // Validation des champs obligatoires
    if (!id_indice || !id_participant) {
      return NextResponse.json(
        { error: 'Les champs id_indice et id_participant sont obligatoires' },
        { status: 400 }
      );
    }

    // Insérer un nouvel enregistrement dans la table Indice_Participant
    const { data, error } = await supabase
      .from('indice_participant')
      .insert([{ id_indice, id_participant, est_decouvert: true, date_utilisation: new Date().toISOString() }])
      .select(); // Ajoutez .select() pour voir les données insérées

    if (error) {
      console.error('Erreur Supabase:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: 'Erreur lors de l\'insertion de l\'enregistrement', details: error.message },
        { status: 500 }
      );
    }

    // Log des données insérées
    console.log('Données insérées:', data);

    return NextResponse.json(
      { message: 'Enregistrement inséré avec succès', data },
      { status: 200 }
    );
  } catch (err) {
    console.error('Erreur inattendue:', err);
    return NextResponse.json(
      { error: 'Une erreur est survenue', details: String(err) },
      { status: 500 }
    );
  }
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { participantId } = req.query;

    if (!participantId) {
      return res.status(400).json({ error: 'Le paramètre participantId est obligatoire' });
    }

    const supabase = createClient();

    try {
      // Récupérer les indices révélés par le participant
      const { data, error } = await supabase
        .from('indice_participant')
        .select('*')
        .eq('id_participant', participantId)
        .eq('est_decouvert', true);


      if (error) {
        console.error('Erreur Supabase:', error);
        return res.status(500).json({ error: 'Erreur lors de la récupération des indices révélés', details: error.message });
      }

      return res.status(200).json(data);
    } catch (err) {
      console.error('Erreur inattendue:', err);
      return res.status(500).json({ error: 'Une erreur est survenue', details: String(err) });
    }
  } else {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }
}