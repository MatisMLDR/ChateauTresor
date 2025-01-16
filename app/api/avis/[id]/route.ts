import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// GET: Récupérer un avis par son ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  console.log("GET API Avis OK");

  try {
    const resolvedParams = await params; // Résolution des paramètres
    const idAvis = resolvedParams.id;

    if (!idAvis) {
      return NextResponse.json(
        { error: 'Paramètre id manquant ou invalide' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('avis')
      .select('*')
      .eq('id_avis', idAvis)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération de l\'avis', details: error.message },
        { status: 500 }
      );
    }

    console.log("Données récupérées : ", data);
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération', details: String(err) },
      { status: 500 }
    );
  }
}

// PUT: Mettre à jour un avis par son ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();

  try {
    const resolvedParams = await params;
    const idAvis = resolvedParams.id;

    if (!idAvis) {
      return NextResponse.json(
        { error: 'Paramètre id manquant ou invalide' },
        { status: 400 }
      );
    }

    const body = await request.json();

    console.log("PUT API Avis body", body);

    const { error } = await supabase
      .from('avis')
      .update(body)
      .eq('id_avis', idAvis);

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour de l\'avis', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Avis mis à jour avec succès' },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la mise à jour', details: String(err) },
      { status: 500 }
    );
  }
}

// DELETE: Supprimer un avis par son ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  console.log("DELETE API Avis OK");

  try {
    const resolvedParams = await params;
    const idAvis = resolvedParams.id;

    if (!idAvis) {
      return NextResponse.json(
        { error: 'Paramètre id manquant ou invalide' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('avis')
      .delete()
      .eq('id_avis', idAvis);

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la suppression de l\'avis', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Avis supprimé avec succès' },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la suppression', details: String(err) },
      { status: 500 }
    );
  }
}