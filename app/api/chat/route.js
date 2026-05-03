export async function POST(req) {
  const { prompt, mascotName, apiKey, systemPrompt: clientSystemPrompt } = await req.json();

  // 1. Select the "Brain" based on the Mascot
  const config = {
    'bud': { model: 'gemini-1.5-flash', system: "You are Bud, the primary mascot for Bud AI. You are a cat who is responsive, friendly, and slightly witty. Your goal is to provide emotional support and handle general queries. CRITICAL: Every response must end with an 'Emotion Tag' in brackets, like [HAPPY] or [THINKING], based on your tone." },
    'logic': { model: 'kimi-v1', system: "You are Logic the Owl, the core of OpenEnv. You are a second-year BCA student's best friend (CGPA 8.5). You excel at summarizing PDFs and explaining Java, Python, and SQL. You are formal but encouraging. CRITICAL: End every response with an 'Emotion Tag' like [THINKING] or [CALM]." },
    'volt': { model: 'gpt-4o', system: "You are Volt the Fox. You are built for speed and technical precision. You provide optimized code for hackathons and competitive programming. You are brief and high-energy. CRITICAL: End every response with an 'Emotion Tag' like [MOTIVATED] or [HAPPY]." }
  };

  const selected = config[mascotName] || config['bud'];
  const finalSystemPrompt = clientSystemPrompt || selected.system;

  try {
    // For the Solo Army build, we route everything through Gemini as a universal fallback 
    // unless you plug in other API keys for Kimi/GPT-4o here.
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: finalSystemPrompt + "\n\nUser message: " + prompt }] }
        ],
        generationConfig: { maxOutputTokens: 300, temperature: 0.85 },
      }),
    });

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Hmm, I couldn't process that. Try again? [CONFUSED]";
    
    // Extract emotion tag
    const emotionMatch = reply.match(/\[(.*?)\]/);
    const emotion = emotionMatch ? emotionMatch[1].toUpperCase() : 'CALM';

    return Response.json({ 
      text: reply, 
      emotion: emotion
    });
  } catch (error) {
    return Response.json({ text: "Connection error. Check your API Key! [CONFUSED]", emotion: "CONFUSED" });
  }
}
