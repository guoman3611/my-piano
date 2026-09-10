import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iwwyyrzlguylckyumgas.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3d3l5cnpsZ3V5Y2xreXVtZ2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMDE0MjksImV4cCI6MjEwNDU3NzQyOX0.seMdsWTPv79RvToPN5_D3rt33D9qsgwF2EUFvhBrcH8';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const table = searchParams.get('table') || 'courses';

    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, table, id, payload } = body;

    let result;
    if (action === 'insert') {
      result = await supabase.from(table).insert(payload);
    } else if (action === 'update') {
      result = await supabase.from(table).update(payload).eq('id', id);
    } else if (action === 'delete') {
      result = await supabase.from(table).delete().eq('id', id);
    }

    if (result && result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
