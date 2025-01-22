import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { id } = await params;
  try {

    console.log("ID DANS ROUTE PROFIL API : ", id);
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single(); // Utilisez maybeSingle() au lieu de single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { id } = await params;
  const body = await req.json();
  try {
    const { data, error } = await supabase.from('profiles').update(body).eq('id', id).select('*').single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  try {
    const { id } = await params;
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Profil supprimé avec succès' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}