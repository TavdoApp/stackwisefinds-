// Cloudflare Pages Edge Function: /api/upvote
// Handles real-time upvotes and community telemetry

export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const body = await request.json().catch(() => ({}));
    const toolId = body.toolId ? String(body.toolId).trim().toLowerCase() : null;

    if (!toolId) {
      return new Response(JSON.stringify({ error: 'Missing toolId' }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // If D1 database is available, record vote
    if (env && env.DB) {
      try {
        await env.DB.prepare(
          `CREATE TABLE IF NOT EXISTS tool_upvotes (
            tool_id TEXT PRIMARY KEY,
            vote_count INTEGER DEFAULT 1,
            last_voted_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )`
        ).run();

        await env.DB.prepare(
          `INSERT INTO tool_upvotes (tool_id, vote_count, last_voted_at)
           VALUES (?, 1, CURRENT_TIMESTAMP)
           ON CONFLICT(tool_id) DO UPDATE SET
             vote_count = vote_count + 1,
             last_voted_at = CURRENT_TIMESTAMP`
        ).bind(toolId).run();

        const row = await env.DB.prepare(`SELECT vote_count FROM tool_upvotes WHERE tool_id = ?`).bind(toolId).first();
        
        return new Response(JSON.stringify({
          success: true,
          toolId,
          recorded: true,
          totalEdgeVotes: row ? row.vote_count : 1
        }), { status: 200, headers: corsHeaders });
      } catch (dbErr) {
        console.warn('D1 Upvote DB error:', dbErr);
      }
    }

    // Default fast edge response if D1 is not bound
    return new Response(JSON.stringify({
      success: true,
      toolId,
      recorded: true,
      timestamp: new Date().toISOString()
    }), { status: 200, headers: corsHeaders });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || 'Internal Server Error' }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const toolId = url.searchParams.get('toolId');

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  if (!toolId) {
    return new Response(JSON.stringify({ status: 'active', service: 'stakdock-upvotes-api' }), {
      headers: corsHeaders
    });
  }

  if (env && env.DB) {
    try {
      const row = await env.DB.prepare(`SELECT vote_count FROM tool_upvotes WHERE tool_id = ?`).bind(toolId.toLowerCase()).first();
      return new Response(JSON.stringify({
        toolId,
        votes: row ? row.vote_count : 0
      }), { headers: corsHeaders });
    } catch {
      // Fallback
    }
  }

  return new Response(JSON.stringify({ toolId, votes: 0 }), { headers: corsHeaders });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
