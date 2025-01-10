import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const id_participant = parseInt(params.id);

  if (isNaN(id_participant)) {
    return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('participant')
    .select('*')
    .eq('id_participant', id_participant)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}