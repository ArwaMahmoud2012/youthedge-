export async function onRequestPost(context) {
  try {
    const apiKey = context.env.GROQ_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: { message: 'Server is missing GROQ_API_KEY' } }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const contentType = context.request.headers.get('content-type') || '';
    const bodyBuffer = await context.request.arrayBuffer();
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
  }
