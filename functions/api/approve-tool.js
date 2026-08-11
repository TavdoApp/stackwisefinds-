export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  const action = url.searchParams.get('action') || 'approve';

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'text/html; charset=utf-8'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!id) {
    return new Response('<h3>Error: Missing submission ID</h3>', { status: 400, headers: corsHeaders });
  }

  if (env && env.DB) {
    try {
      const newStatus = action === 'reject' ? 'rejected' : 'approved';
      await env.DB.prepare(
        'UPDATE vendor_submissions SET status = ? WHERE id = ?'
      ).bind(newStatus, id).run();

      return new Response(`
        <div style="font-family: system-ui, sans-serif; max-width: 500px; margin: 40px auto; padding: 30px; border-radius: 16px; border: 1px solid #C2DC8E; background: #F9FBF5; text-align: center;">
          <h2 style="color: #82A735; margin-bottom: 8px;">Submission #${id} Updated!</h2>
          <p style="color: #333; font-size: 1.1rem;">Status set to: <strong>${newStatus.toUpperCase()}</strong></p>
          <p style="color: #666; font-size: 0.9rem;">The change is now live on StakDock.com.</p>
          <a href="https://stakdock.com" style="display: inline-block; margin-top: 16px; padding: 10px 20px; background: #82A735; color: white; border-radius: 9999px; text-decoration: none; font-weight: bold;">Return to StakDock</a>
        </div>
      `, { status: 200, headers: corsHeaders });
    } catch (dbErr) {
      return new Response(`<h3>DB Update Error: ${dbErr.message}</h3>`, { status: 500, headers: corsHeaders });
    }
  }

  return new Response('<h3>D1 Database Binding Unavailable</h3>', { status: 500, headers: corsHeaders });
}
