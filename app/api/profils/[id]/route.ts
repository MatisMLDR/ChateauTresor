import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', params.id).single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  try {
    const body = await req.json();
    const { data, error } = await supabase.from('profiles').update(body).eq('id', params.id).select('*').single();
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
    const { error } = await supabase.from('profiles').delete().eq('id', params.id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Profil supprimé avec succès' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}