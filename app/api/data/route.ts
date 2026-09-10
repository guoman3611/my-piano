import { NextResponse } from 'next/server';

const SUPABASE_URL = 'https://iwwyyrzlguylckyumgas.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3d3l5cnpsZ3V5Y2xreXVtZ2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMDE0MjksImV4cCI6MjEwNDU3NzQyOX0.seMdsWTPv79RvToPN5_D3rt33D9qsgwF2EUFvhBrcH8';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const table = searchParams.get('table') || 'courses';

  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&order=id.asc`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    },
    cache: 'no-store'
  });

  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { action, table, id, payload } = body;

  let url = `${SUPABASE_URL}/rest/v1/${table}`;
  let method = 'POST';

  if (action === 'update') {
    url += `?id=eq.${id}`;
    method = 'PATCH';
  } else if (action === 'delete') {
    url += `?id=eq.${id}`;
    method = 'DELETE';
  }

  const res = await fetch(url, {
    method,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: payload ? JSON.stringify(payload) : undefined
  });

  const data = await res.text();
  return new NextResponse(data, { status: res.status });
}
