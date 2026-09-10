import { NextResponse } from 'next/server';

const SUPABASE_URL = 'https://iwwyyrzlguylckyumgas.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3d3l5cnpsZ3V5Y2xreXVtZ2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMDE0MjksImV4cCI6MjEwNDU3NzQyOX0.seMdsWTPv79RvToPN5_D3rt33D9qsgwF2EUFvhBrcH8';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const table = searchParams.get('table') || 'courses';

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&order=id.asc`, {
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
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return NextResponse.json({
      error: err.message,
      cause: err.cause ? String(err.cause) : null,
      code: err.cause?.code || null
    }, { status: 500 });
  }
}
