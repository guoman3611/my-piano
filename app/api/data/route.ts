import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://iwwyyrzlguylckyumgas.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3d3l5cnpsZ3V5Y2xreXVtZ2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMDE0MjksImV4cCI6MjEwNDU3NzQyOX0.seMdsWTPv79RvToPN5_D3rt33D9qsgwF2EUFvhBrcH8';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false }
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const table = searchParams.get('table') || 'courses';

  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      return NextResponse.json({ sdk_error: error }, { status: 400 });
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (err: any) {
    return NextResponse.json({
      crash_error: err.message,
      stack: err.stack
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, table, id, payload } = body;

    let resData: any = null;
    let resErr: any = null;

    if (action === 'update') {
      const { data, error } = await supabase
        .from(table)
        .update(payload)
        .eq('id', id)
        .select();
      resData = data;
      resErr = error;
    } else if (action === 'delete') {
      const { data, error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      resData = data;
      resErr = error;
    } else {
      // 默认新增
      const { data, error } = await supabase
        .from(table)
        .insert([payload])
        .select();
      resData = data;
      resErr = error;
    }

    if (resErr) {
      return NextResponse.json({ error: resErr }, { status: 400 });
    }

    return NextResponse.json(resData);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
