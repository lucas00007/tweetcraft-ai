import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { topic, tone, includeCode } = await request.json();

    const codeInstruction = includeCode ? " Include relevant code snippets when appropriate." : "";
    
    const prompt = `You are an expert at writing engaging tweets for developers and tech Twitter. Generate 10 tweet options about: ${topic}. Tone: ${tone}. Requirements: under 280 chars, developer-focused, include emojis sparingly, vary formats (questions, lessons, hot takes), number each tweet 1-10.${codeInstruction}`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    });

    const tweets = message.content[0].text;
    
    return Response.json({ tweets });
  } catch (error) {
    return Response.json({ error: 'Failed to generate tweets' }, { status: 500 });
  }
}