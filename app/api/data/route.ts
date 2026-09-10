import { NextResponse } from 'next/server';
import https from 'https';

const SUPABASE_HOST = 'iwwyyrzlguylckyumgas.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3d3l5cnpsZ3V5Y2xreXVtZ2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMDE0MjksImV4cCI6MjEwNDU3NzQyOX0.seMdsWTPv79RvToPN5_D3rt33D9qsgwF2EUFvhBrcH8';

// 缓存解析到的真实 IP
let cachedIp: string | null = null;

// 使用 DNS-over-HTTPS (DoH) 彻底避开 Vercel 破损的系统 getaddrinfo
async function resolveIpByDoH(hostname: string): Promise<string> {
  if (cachedIp) return cachedIp;
  try {
    const res = await fetch(`https://1.1.1.1/dns-query?name=${hostname}&type=A`, {
      headers: { 'Accept': 'application/dns-json' },
      cache: 'force-cache'
    });
    const json = await res.json();
    if (json.Answer && json.Answer.length > 0) {
      cachedIp = json.Answer[json.Answer.length - 1].data;
      return cachedIp!;
    }
  } catch (e) {
    // 备用 Google DoH
    const res = await fetch(`https://dns.google/resolve?name=${hostname}&type=A`);
    const json = await res.json();
    if (json.Answer && json.Answer.length > 0) {
      cachedIp = json.Answer[json.Answer.length - 1].data;
      return cachedIp!;
    }
  }
  throw new Error('DoH resolution failed');
}

async function requestSupabase(path: string, method: string = 'GET', bodyData?: any): Promise<{ status: number, data: any }> {
  const ip = await resolveIpByDoH(SUPABASE_HOST);

  return new Promise((resolve, reject) => {
    let payload = '';
    if (bodyData !== undefined) {
      const finalData = (method === 'POST' && !Array.isArray(bodyData)) ? [bodyData] : bodyData;
      payload = JSON.stringify(finalData);
    }

    const req = https.request({
      host: ip, // 直接连接解析到的目标真实 IP
      servername: SUPABASE_HOST, // SNI 握手保持证书有效
      port: 443,
      path: path,
      method: method,
      headers: {
        'Host': SUPABASE_HOST,
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
      }
    }, (res) => {
      let chunks = '';
      res.on('data', (c) => { chunks += c; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode || 200, data: JSON.parse(chunks) });
        } catch {
          resolve({ status: res.statusCode || 200, data: chunks });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (payload) req.write(payload);
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
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
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
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
