import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req) {
  try {
    const { topic, tone, includeCode } = await req.json();
    
    console.log('✅ Received request:', { topic, tone, includeCode });
    console.log('✅ API Key exists:', !!process.env.ANTHROPIC_API_KEY);
    console.log('✅ API Key starts with:', process.env.ANTHROPIC_API_KEY?.substring(0, 10));

    const prompt = `You are an expert at writing engaging tweets for developers and tech Twitter.

Generate 10 tweet options about: "${topic}"

Tone: ${tone}
Include code: ${includeCode ? 'Yes' : 'No'}

Requirements:
- Write for a developer audience (technical but accessible)
- Under 280 characters per tweet
- Use developer language/terminology naturally
- Include emojis sparingly (🚀, 💡, 🧵, ⚡)
- Some should be "learning in public" style
- Some should be technical threads (numbered)
${includeCode ? '- Include properly formatted code snippets where relevant (use backticks)' : ''}
- Make them authentic, not overly promotional
- Vary the formats: questions, lessons learned, hot takes, tips

Format: Number each tweet (1-10) clearly separated.`;

    console.log('✅ Calling Anthropic API with model: claude-3-5-sonnet-20241022');

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2500,
      messages: [{ role: 'user', content: prompt }],
    });

    console.log('✅ Got response from Anthropic!');

    const tweets = message.content[0].text;
    return NextResponse.json({ tweets });
    
  } catch (error) {
    console.error('❌ FULL ERROR:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error status:', error.status);
    
    return NextResponse.json(
      { error: 'Failed to generate tweets: ' + error.message },
      { status: 500 }
    );
  }
}