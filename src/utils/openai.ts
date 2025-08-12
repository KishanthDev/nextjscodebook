export async function correctSpelling(text: string, apiKey: string): Promise<string> {
  const systemPrompt =
    'Fix spelling mistakes of the following text, return only the corrected version, or the original if none. Never add comments:';
  const body = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `"""${text}"""` },
    ],
    max_tokens: 1000,
    temperature: 0,
  };

  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const msg = await resp.text();
    throw new Error('OpenAI error: ' + msg);
  }
  const data = await resp.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}
