import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const id_participant = searchParams.get('id_participant');
  const id_chasse = searchParams.get('id_chasse');

  // Vérification des paramètres
  if (!id_participant || !id_chasse) {
    return NextResponse.json(
      { error: 'Paramètres id_participant ou id_chasse manquants' },
      { status: 400 }
    );
  }

  try {
    // Requête pour vérifier l'existence de la participation
    const { data, error } = await supabase
      .from('participation')
      .select('*')
      .eq('id_participant', id_participant)
      .eq('id_chasse', id_chasse);

    if (error) {
      throw error;
    }

    // Renvoie true si une participation existe, sinon false
    return NextResponse.json({ exists: data && data.length > 0 }, { status: 200 });
  } catch (error) {
    console.error('Erreur dans la route API participation/exists :', error);
    return NextResponse.json({ exists: false }, { status: 500 });
  }
}