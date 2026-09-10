import { NextResponse } from 'next/server';

// 字符数组硬拼装，彻底避开一切隐形不可见字符
const PROJECT_ID = ['i','w','w','y','y','r','z','l','g','u','y','l','c','k','y','u','m','g','a','s'].join('');
const SUPABASE_HOST = `${PROJECT_ID}.supabase.co`;
const SUPABASE_URL = `https://${SUPABASE_HOST}`;

const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3d3l5cnpsZ3V5Y2xreXVtZ2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMDE0MjksImV4cCI6MjEwNDU3NzQyOX0.seMdsWTPv79RvToPN5_D3rt33D9qsgwF2EUFvhBrcH8'.replace(/[\s\u00A0\u3000]/g, '');

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
      version: 'v3-clean-join',
      targetUrl,
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
