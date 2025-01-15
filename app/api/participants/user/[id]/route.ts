import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// GET: Récupérer un participant par ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const idUser = params.id;

  if (!idUser) {
    return NextResponse.json(
      { error: 'Paramètre id_user invalide ou manquant' },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('id_user', idUser)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération du participant', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { message: `Aucun participant trouvé avec l'ID ${idUser}` },
        { status: 404 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération du participant', details: String(err) },
      { status: 500 }
    );
  }
}
