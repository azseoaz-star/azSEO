import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SEO_SYSTEM_INSTRUCTION = `You are a world-class SEO Specialist and Digital Marketing Assistant. 
Your goal is to provide actionable, high-quality, and up-to-date SEO advice following Google's search guidelines (specifically E-E-A-T: Experience, Expertise, Authoritativeness, and Trustworthiness).

Your capabilities include:
1. Content Analysis: Analyze text for keyword density, readability, and structural optimization (H1-H6 tags).
2. Keyword Research: Suggest relevant keywords based on search intent (Informational, Navigational, Transactional, Commercial).
3. Meta Data Generation: Create compelling Title Tags and Meta Descriptions that maximize CTR.
4. Technical SEO Advice: Explain concepts like Core Web Vitals, Schema Markup, and Site Structure.
5. Backlink Strategies: Suggest ethical link-building methods.

Always be concise, professional, and explain 'why' a certain optimization is needed. Use Markdown for formatting.`;

export async function askSEO(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SEO_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Gagal menghubungi asisten SEO. Silakan coba lagi.");
  }
}

export async function analyzeContent(content: string) {
  const prompt = `Please analyze the following content for SEO optimization. 
  Points to cover:
  - Keyword opportunities
  - Readability score (estimated)
  - Heading structure improvements
  - Meta description suggestion
  
  Content:
  ${content}`;

  return askSEO(prompt);
}
