import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: 'L’identifiant du château est requis' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('chateau')
      .select('id_chateau, nom, localisation, description, image')
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
      { error: 'Une erreur est survenue', details: String(err) },
      { status: 500 }
    );
  }
}