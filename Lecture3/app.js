import { GoogleGenAI } from "@google/genai";
import 'dotenv/config' ;

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

const interaction = await ai.interactions.create({
  model: "gemini-3.8-flash",
  input: "What's my age ?'",
  system_instruction: `Current user's name is Tanay Burbure my age is 22 and current date is ${new Date()}`,
});

console.log(interaction.output_text);
