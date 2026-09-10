import { NextResponse } from 'next/server';

const TARGET_HOST = 'https://iwwyyrzlguylckyumgas.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3d3l5cnpsZ3V5Y2xreXVtZ2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMDE0MjksImV4cCI6MjEwNDU3NzQyOX0.seMdsWTPv79RvToPN5_D3rt33D9qsgwF2EUFvhBrcH8';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const table = searchParams.get('table') || 'courses';
  const targetUrl = `${TARGET_HOST}/rest/v1/${table}?select=*&order=id.asc`;

  try {
    const res = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
      cache: 'no-store'
    });

    const bodyText = await res.text();
    return new NextResponse(bodyText, {
      status: res.status,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, table, id, payload } = body;

    let targetUrl = `${TARGET_HOST}/rest/v1/${table}`;
    let method = 'POST';

    if (action === 'update') {
      targetUrl += `?id=eq.${id}`;
      method = 'PATCH';
    } else if (action === 'delete') {
      targetUrl += `?id=eq.${id}`;
      method = 'DELETE';
    }

    // Supabase 插入数据要求是数组，如果传入的是单个对象则自动包裹
    const postBody = (action === 'insert' && !Array.isArray(payload)) ? [payload] : payload;

    const res = await fetch(targetUrl, {
      method,
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: postBody !== undefined ? JSON.stringify(postBody) : undefined
    });

    const bodyText = await res.text();
    return new NextResponse(bodyText, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
