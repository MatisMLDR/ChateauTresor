import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const participantId = searchParams.get('participantId');

  // Validation UUID
  if (!participantId) {
    return NextResponse.json(
      { error: 'ID participant invalide' },
      { status: 400 }
    );
  }

  const supabase = createClient();

  try {
    // 1. Récupérer les id_chasse depuis les participations
    const { data: participations, error } = await supabase
      .from('participation')
      .select('id_chasse')
      .eq('id_participant', participantId);

    if (error) throw error;

    // Cas aucune participation trouvée
    if (!participations?.length) {
      return NextResponse.json([]);
    }

    // 2. Récupérer les chasses correspondantes
    const chasseIds = participations.map(p => p.id_chasse);
    
    const { data: chasses, error: chasseError } = await supabase
      .from('chasse')
      .select('*')
      .in('id_chasse', chasseIds);

    if (chasseError) throw chasseError;

    return NextResponse.json(chasses || []);

  } catch (error) {
    console.error('[CHASSES_PARTICIPANT] Error:', error);
    return NextResponse.json(
      { error: 'Erreur de base de données' },
      { status: 500 }
    );
  }
}