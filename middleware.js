// Vercel Routing Middleware — wachtwoord op de hele site.
// Zet SITE_PASSWORD in Vercel (Settings → Environment Variables, Production + Preview) en redeploy.
// Uitloggen: ga naar /api/logout

export const config = { matcher: '/:path*' };

const COOKIE = 'tresor_auth';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 dagen ingelogd blijven

// Cookie bevat een afgeleide sleutel, nooit het wachtwoord zelf
async function token(secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode('tresor-preview'));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/[+/=]/g, '');
}

function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

function safeNext(n) {
  return n && n.startsWith('/') && !n.startsWith('//') && !n.startsWith('/login') && !n.startsWith('/api/') ? n : '/';
}

function getCookie(request, name) {
  const m = (request.headers.get('cookie') || '').match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
  return m ? m[1] : null;
}

function redirect(request, path, headers = {}) {
  return new Response(null, { status: 303, headers: { Location: new URL(path, request.url).toString(), ...headers } });
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const secret = process.env.SITE_PASSWORD;

  // Inlogpagina is altijd bereikbaar
  if (url.pathname === '/login.html' || url.pathname === '/login') return;

  // Inloggen
  if (url.pathname === '/api/login' && request.method === 'POST') {
    const form = await request.formData();
    const pw = String(form.get('wachtwoord') || '');
    const next = safeNext(String(form.get('next') || ''));
    if (secret && safeEqual(pw, secret)) {
      return redirect(request, next, {
        'Set-Cookie': `${COOKIE}=${await token(secret)}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
      });
    }
    return redirect(request, `/login.html?fout=1&next=${encodeURIComponent(next)}`);
  }

  // Uitloggen
  if (url.pathname === '/api/logout') {
    return redirect(request, '/login.html', {
      'Set-Cookie': `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`,
    });
  }

  // Ingelogd? Doorlaten.
  const c = getCookie(request, COOKIE);
  if (secret && c && safeEqual(c, await token(secret))) return;

  // Anders naar de inlogpagina, met terugverwijzing
  return redirect(request, `/login.html?next=${encodeURIComponent(url.pathname + url.search)}`);
}
