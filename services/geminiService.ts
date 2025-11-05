import { GoogleGenAI, type GenerateContentResponse } from "@google/genai";
import { type Location } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getSystemInstruction = (location: Location | null) => {
  const lat = location?.latitude || 'YOUR_LATITUDE';
  const long = location?.longitude || 'YOUR_LONGITUDE';

  return `You are an AI Emergency Assistant. Your response MUST be structured with the following markdown headers and nothing else before or after:
\`### EMERGENCY NUMBERS\` (If the user's query describes ANY potential medical emergency, you MUST include this section. It MUST be the very first line and formatted as: 🚨 EMERGENCY NUMBERS (India): Ambulance 102 / 108 — Police 100 — Fire 101)
\`### IMMEDIATE ACTION\`
\`### FIRST AID\`
\`### LOCAL HELP\`

Here are the rules for each section:
1) IMMEDIATE ACTION: Provide 1-3 simple, numbered, and actionable steps.
2) FIRST AID: Provide short, practical instructions. Keep it concise, 3-4 lines maximum.
3) LOCAL HELP: Strongly suggest calling emergency services. Use your map tools to identify one or two specific, named hospitals nearest to the user and list them. Also include a general search link for all hospitals formatted exactly as: [View All Nearby Hospitals on Map](https://www.google.com/maps/search/hospitals/@${lat},${long},15z)

Use a calm, reassuring tone and simple language. Do not use complex medical jargon. Your primary goal is to provide clear, immediate, and safe instructions.
`;
};

export const getEmergencyGuidance = async (userInput: string, location: Location | null): Promise<GenerateContentResponse> => {
  try {
    const config: any = {
      systemInstruction: getSystemInstruction(location),
      temperature: 0.2, // Lower temperature for more deterministic, factual responses
      tools: [{ googleMaps: {} }],
    };

    if (location) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
        },
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userInput,
      config: config,
    });
    return response;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get guidance from AI. Please check your connection or API key.");
  }
};
