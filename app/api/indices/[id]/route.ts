import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// Récupérer un indice par ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {id:indiceId} = await params

  console.log('Récupération de l\'indice avec ID:', indiceId); // Log pour déboguer

  if (!indiceId) {
    return NextResponse.json(
      { error: 'ID de l\'indice manquant' },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from('indice') // Assurez-vous que c'est le bon nom de table
      .select('*')
      .eq('id_indice', indiceId) // Utilisez la colonne correcte dans Supabase
      .single();

    if (error) {
      console.error('Erreur Supabase:', error); // Log pour déboguer
      return NextResponse.json(
        { error: 'Erreur lors de la récupération de l\'indice', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('Erreur inattendue:', err); // Log pour déboguer
    return NextResponse.json(
      { error: 'Une erreur est survenue', details: String(err) },
      { status: 500 }
    );
  }
}

// Mettre à jour un indice par ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {id:indiceId} = await params
  const body = await request.json();

  console.log('Mise à jour de l\'indice avec ID:', indiceId); // Log pour déboguer
  console.log('Données reçues:', body); // Log pour déboguer

  try {
    const { error } = await supabase
      .from('indice') // Assurez-vous que c'est le bon nom de table
      .update(body)
      .eq('id_indice', indiceId); // Utilisez la colonne correcte dans Supabase

    if (error) {
      console.error('Erreur Supabase:', error); // Log pour déboguer
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour de l\'indice', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Indice mis à jour avec succès' },
      { status: 200 }
    );
  } catch (err) {
    console.error('Erreur inattendue:', err); // Log pour déboguer
    return NextResponse.json(
      { error: 'Une erreur est survenue', details: String(err) },
      { status: 500 }
    );
  }
}

// Supprimer un indice par ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {id:indiceId} = await params

  console.log('Suppression de l\'indice avec ID:', indiceId); // Log pour déboguer

  try {
    const { error } = await supabase
      .from('indice') // Assurez-vous que c'est le bon nom de table
      .delete()
      .eq('id_indice', indiceId); // Utilisez la colonne correcte dans Supabase

    if (error) {
      console.error('Erreur Supabase:', error); // Log pour déboguer
      return NextResponse.json(
        { error: 'Erreur lors de la suppression de l\'indice', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Indice supprimé avec succès' },
      { status: 200 }
    );
  } catch (err) {
    console.error('Erreur inattendue:', err); // Log pour déboguer
    return NextResponse.json(
      { error: 'Une erreur est survenue', details: String(err) },
      { status: 500 }
    );
  }
}