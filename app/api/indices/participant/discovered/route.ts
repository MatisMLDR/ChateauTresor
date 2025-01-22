import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const participantId = searchParams.get('participantId');
  const indiceId = searchParams.get('idIndice');

  // Validation basique
  if (!participantId || !indiceId) {
    return NextResponse.json(
      { error: 'Paramètres manquants' },
      { status: 400 }
    );
  }

  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('indice_participant')
      .select('*')
      .eq('id_participant', participantId)
      .eq('id_indice', indiceId)
      .maybeSingle(); // Accepte les résultats null

    if (error) throw error;

    // Renvoie explicitement exists: true/false
    return NextResponse.json({ exists: !!data });

  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}