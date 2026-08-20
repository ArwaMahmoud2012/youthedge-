export async function onRequestPost(context) {
  try {
    const apiKey = context.env.GROQ_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: { message: 'Server is missing GROQ_API_KEY' } }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const body = await context.request.text();
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
