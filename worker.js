export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/groq-chat' && request.method === 'POST') {
      return handleGroqChat(request, env);
    }
    if (url.pathname === '/api/groq-audio' && request.method === 'POST') {
      return handleGroqAudio(request, env);
    }

    // Everything else: serve the static app files as normal
    return env.ASSETS.fetch(request);
  }
};

async function handleGroqChat(request, env) {
  try {
    const apiKey = env.GROQ_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: { message: 'Server is missing GROQ_API_KEY' } }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const body = await request.text();
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body
    });
    const data = await res.text();
    return new Response(data, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: { message: 'Proxy error' } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

async function handleGroqAudio(request, env) {
  try {
    const apiKey = env.GROQ_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: { message: 'Server is missing GROQ_API_KEY' } }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const contentType = request.headers.get('content-type') || '';
    const bodyBuffer = await request.arrayBuffer();
    const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': contentType
      },
      body: bodyBuffer
    });
    const data = await res.text();
    return new Response(data, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: { message: 'Proxy error' } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
