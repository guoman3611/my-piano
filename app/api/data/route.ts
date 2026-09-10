import { NextResponse } from 'next/server';
import https from 'https';
import dns from 'dns';

// 强制将 DNS 解析服务器指定为 Google (8.8.8.8) 和 Cloudflare (1.1.1.1)
// 彻底解决 Vercel 容器默认 DNS 触发的 ENOTFOUND 故障
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

const SUPABASE_HOST = 'iwwyyrzlguylckyumgas.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3d3l5cnpsZ3V5Y2xreXVtZ2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMDE0MjksImV4cCI6MjEwNDU3NzQyOX0.seMdsWTPv79RvToPN5_D3rt33D9qsgwF2EUFvhBrcH8';

function requestSupabase(path: string, method: string = 'GET', bodyData?: any): Promise<{ status: number, data: any }> {
  return new Promise((resolve, reject) => {
    let payload = '';
    if (bodyData !== undefined) {
      // 保证插入数据符合 Supabase 数组规范
      const finalData = (method === 'POST' && !Array.isArray(bodyData)) ? [bodyData] : bodyData;
      payload = JSON.stringify(finalData);
    }

    const options: https.RequestOptions = {
      hostname: SUPABASE_HOST,
      port: 443,
      path: path,
      method: method,
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
      }
    };

    const req = https.request(options, (res) => {
      let chunks = '';
      res.on('data', (chunk) => { chunks += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode || 200, data: JSON.parse(chunks) });
        } catch {
          resolve({ status: res.statusCode || 200, data: chunks });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const table = searchParams.get('table') || 'courses';

  try {
    const result = await requestSupabase(`/rest/v1/${table}?select=*&order=id.asc`, 'GET');
    return NextResponse.json(result.data, {
      status: result.status,
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, code: err.code }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, table, id, payload } = body;

    let path = `/rest/v1/${table}`;
    let method = 'POST';

    if (action === 'update') {
      path += `?id=eq.${id}`;
      method = 'PATCH';
    } else if (action === 'delete') {
      path += `?id=eq.${id}`;
      method = 'DELETE';
    }

    const result = await requestSupabase(path, method, payload);
    return NextResponse.json(result.data, { status: result.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, code: err.code }, { status: 500 });
  }
}
