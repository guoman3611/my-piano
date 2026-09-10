import { NextResponse } from 'next/server';

// 强制用正则剔除字符串里的所有空格、换行和隐形字符
const RAW_URL = 'https://iwwyyrzlguylckyumgas.supabase.co';
const SUPABASE_URL = RAW_URL.replace(/\s+/g, '');

const RAW_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3d3l5cnpsZ3V5Y2xreXVtZ2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMDE0MjksImV4cCI6MjEwNDU3NzQyOX0.seMdsWTPv79RvToPN5_D3rt33D9qsgwF2EUFvhBrcH8';
const SUPABASE_KEY = RAW_KEY.replace(/\s+/g, '');

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const table = searchParams.get('table') || 'courses';

  const targetUrl = `${SUPABASE_URL}/rest/v1/${table}?select=*&order=id.asc`;

  try {
    const res = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
      cache: 'no-store'
    });

    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (err: any) {
    return NextResponse.json({
      version: 'v2-no-space',
      targetUrl: targetUrl,
      error: err.message,
      cause: err.cause ? String(err.cause) : null
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
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

    const text = await res.text();
    return new NextResponse(text, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
