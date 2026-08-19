export async function onRequest(context) {
  const url = new URL(context.request.url);

  // 1. Strict 301 Permanent Domain Redirect Guard: stackwisefinds.com -> stakdock.com
  if (url.hostname.includes('stackwisefinds.com')) {
    url.hostname = 'stakdock.com';
    return Response.redirect(url.toString(), 301);
  }

  // 2. Strict 301 Permanent Protocol Guard: http -> https
  if (url.protocol === 'http:') {
    url.protocol = 'https:';
    return Response.redirect(url.toString(), 301);
  }

  // 3. Strict 301 Trailing-Slash Canonical Redirect Guard for routes
  // Exclude static assets (.png, .svg, .ico, .xml, .txt, .json, .js, .css, .webmanifest) and API routes
  if (
    !url.pathname.endsWith('/') &&
    !url.pathname.includes('.') &&
    !url.pathname.startsWith('/api')
  ) {
    url.pathname = `${url.pathname}/`;
    return Response.redirect(url.toString(), 301);
  }

  return context.next();
}
