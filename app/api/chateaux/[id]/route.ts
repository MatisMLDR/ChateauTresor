import { createClient } from '@/utils/supabase/server';
import { UUID } from 'crypto';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: UUID } }) {
  const supabase = createClient();

  try {
    const { id } = await params; // Attendre `params` pour éviter l'erreur

    if (!id) {
      return NextResponse.json(
        { error: 'L’identifiant du château est requis' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('chateau')
      .select('*')
      .eq('id_chateau', id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération du château', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération', details: String(err) },
      { status: 500 }
    );
  }
}