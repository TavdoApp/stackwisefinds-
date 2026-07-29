export async function onRequest(context) {
  const url = new URL(context.request.url);

  // Strict 301 Permanent Domain Redirect Guard: stackwisefinds.com -> stakdock.com
  if (url.hostname.includes('stackwisefinds.com')) {
    url.hostname = 'stakdock.com';
    return Response.redirect(url.toString(), 301);
  }

  return context.next();
}
