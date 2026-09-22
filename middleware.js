export const config = { matcher: '/:path*' };

export default function middleware(request) {
  const auth = request.headers.get('authorization');
  if (auth?.startsWith('Basic ')) {
    const decoded = atob(auth.slice(6));
    const i = decoded.indexOf(':');
    const user = decoded.slice(0, i);
    const pass = decoded.slice(i + 1);
    if (user === process.env.SITE_USER && pass === process.env.SITE_PASSWORD) return;
  }
  return new Response('Toegang vereist', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Tresor preview"' },
  });
}
