// app/api/chateaux/pagination/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);

  try {
    // Récupération des paramètres
    const page = Number(searchParams.get('page')) || 1;
    const pageSize = Number(searchParams.get('pageSize')) || 10;
    const search = searchParams.get('search') || '';

    // Calcul de l'index de départ
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize - 1;

    // Construction de la requête
    let query = supabase
      .from('chateau')
      .select('*', { count: 'exact' })
      .range(startIndex, endIndex);

    // Ajout de la recherche si nécessaire
    if (search) {
      query = query.ilike('nom', `%${search}%`);
    }

    // Exécution de la requête
    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération paginée', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      currentPage: page,
      totalPages: Math.ceil((count || 0) / pageSize),
      totalItems: count
    }, { status: 200 });

  } catch (err) {
    return NextResponse.json(
      { error: 'Une erreur est survenue', details: String(err) },
      { status: 500 }
    );
  }
}