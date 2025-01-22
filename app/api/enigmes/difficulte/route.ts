import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// Récupérer la difficulté d'une énigme par ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {id:enigmeId} = await params

  try {
    const { data, error } = await supabase
      .from('enigme')
      .select('difficulte')
      .eq('id_enigme', enigmeId)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Erreur lors de la récupération de la difficulté de l\'énigme', details: error.message }, { status: 500 });
    }

    return NextResponse.json({ degre_difficulte: data.difficulte }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Une erreur est survenue', details: err }, { status: 500 });
  }
}