import OpenAI from 'openai';
import { json } from '@sveltejs/kit';
import { OPENAI_API_KEY } from '$env/static/private';

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY
});

export async function POST({ request }) {
    const { techName } = await request.json();

    if (!techName) {
        return json({ error: 'Tech name is required' }, { status: 400 });
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a color expert for brand identities and programming technologies. Your task is to provide the most representative HEX color code for a given technology, programming language, or framework. Return ONLY the hex code (including #), nothing else."
                },
                {
                    role: "user",
                    content: `What is the official brand color or most representative color for the technology/programming language named "${techName}"?`
                }
            ],
            max_tokens: 7,
            temperature: 0
        });

        const hexCode = response.choices[0].message.content?.trim();
        
        // Basic validation of hex code
        if (hexCode && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hexCode)) {
            return json({ color: hexCode });
        }

        return json({ color: '#666666' }); // Default fallback
    } catch (error) {
        console.error('OpenAI Error:', error);
        return json({ error: 'Failed to generate color' }, { status: 500 });
    }
}

