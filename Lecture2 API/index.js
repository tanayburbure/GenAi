import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

async function main() {
    try {
        console.log("Sending request...");

        const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: "what is current date ?"
        });

        console.log("Response received:");
        console.log(response.text);

    } catch (error) {
        console.error("API Error:", error.message);
    }
}

main();