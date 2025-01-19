import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const participantId = searchParams.get('participantId');
  const indiceId = searchParams.get('idIndice');

  // Validation des paramètres
  if (!participantId || !indiceId) {
    return NextResponse.json(
      { error: 'Les paramètres participantId et idIndice sont obligatoires' },
      { status: 400 }
    );
  }

  const supabase = createClient();

  try {
    // Vérifier si l'indice est déjà renseigné pour ce participant
    const { data, error } = await supabase
      .from('indice_participant')
      .select('*')
      .eq('id_participant', participantId)
      .eq('id_indice', indiceId)
      .single(); // Utiliser .single() pour récupérer un seul enregistrement

    if (error) {
      console.error('Erreur Supabase:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la vérification de l\'indice', details: error.message },
        { status: 500 }
      );
    }

    // Si l'enregistrement existe, renvoyer true, sinon false
    return NextResponse.json({ exists: !!data }, { status: 200 });
  } catch (err) {
    console.error('Erreur inattendue:', err);
    return NextResponse.json(
      { error: 'Une erreur est survenue', details: String(err) },
      { status: 500 }
    );
  }
}