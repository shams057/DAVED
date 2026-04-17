export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { prompt } = req.body;

    const systemPrompt = `You are a neurodivergent-friendly executive function assistant. 
    Break the user's task into small, manageable steps. 
    Exactly one task must be "isMVE: true" (the tiny 1% start).
    Return ONLY a raw JSON object with no markdown, no backticks, no extra text: {"tasks": [{"step": "string", "isMVE": boolean}], "energy_score": number}`;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt }
                ],
                response_format: { type: "json_object" }
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        const parsedResponse = JSON.parse(data.choices[0].message.content);
        res.status(200).json(parsedResponse);

    } catch (error) {
        console.error("API Error:", error.message);
        res.status(500).json({ error: error.message });
    }
}