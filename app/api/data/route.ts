import { NextResponse } from 'next/server';

const SUPABASE_HOST = 'https://iwwyyrzlguylckyumgas.supabase.co';

// 优先使用 service_role key 获得写入权限，如果未填则回退到 anon key
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3d3l5cnpsZ3V5Y2xreXVtZ2FzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTAwMTQyOSwiZXhwIjoyMTA0NTc3NDI5fQ.BJgR1XjerznWzc9mEsF9_3jT9AsJJHlWVAtdmrJopj4';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const table = searchParams.get('table') || 'courses';

  try {
    const res = await fetch(`${SUPABASE_HOST}/rest/v1/${table}?select=*&order=id.asc`, {
      method: 'GET',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
      },
      cache: 'no-store'
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { action, table, id, payload } = await req.json();

    let url = `${SUPABASE_HOST}/rest/v1/${table}`;
    let method = 'POST';

    if (action === 'update') {
      url += `?id=eq.${id}`;
      method = 'PATCH';
    } else if (action === 'delete') {
      url += `?id=eq.${id}`;
      method = 'DELETE';
    }

    const headers: Record<string, string> = {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };

    const res = await fetch(url, {
      method,
      headers,
      body: payload ? JSON.stringify(payload) : undefined
    });

    const text = await res.text();
    let jsonResult;
    try {
      jsonResult = JSON.parse(text);
    } catch {
      jsonResult = { message: text };
    }

    if (!res.ok) {
      return NextResponse.json({ detail: jsonResult, status: res.status }, { status: res.status });
    }

    return NextResponse.json(jsonResult);
  } catch (err: any) {
    return NextResponse.json({ error: err.message, cause: err.cause ? String(err.cause) : null }, { status: 500 });
  }
}
