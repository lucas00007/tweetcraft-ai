import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    console.log('API Key exists:', !!process.env.ANTHROPIC_API_KEY);
    console.log('API Key starts with:', process.env.ANTHROPIC_API_KEY?.substring(0, 10));
    
    const { topic, tone, includeCode } = await request.json();
    console.log('Request data:', { topic, tone, includeCode });

    const codeInstruction = includeCode ? " Include relevant code snippets when appropriate." : "";
    
    const prompt = `You are an expert at writing engaging tweets for developers and tech Twitter. Generate 10 tweet options about: ${topic}. Tone: ${tone}. Requirements: under 280 chars, developer-focused, include emojis sparingly, vary formats (questions, lessons, hot takes), number each tweet 1-10.${codeInstruction}`;

    console.log('Calling Anthropic API...');
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    });

    const tweets = message.content[0].text;
    console.log('Generated tweets:', tweets);
    
    return Response.json({ tweets });
  } catch (error) {
    console.error('API Error details:', JSON.stringify(error, null, 2));
    console.error('Error message:', error.message);
    console.error('Error status:', error.status);
    if (error.error) {
      console.error('Nested error:', JSON.stringify(error.error, null, 2));
    }
    return Response.json({ error: `Failed to generate tweets: ${error.message}` }, { status: 500 });
  }
}