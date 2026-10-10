import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import readlineSync from "readline-sync";

const ai = new GoogleGenAI({});

async function main() {
  const chat = await ai.chats.create({
    model: "gemini-3.7-flash",
    history : [],
  });

  while(true){
    const question = readlineSync.question("Ask Me Anything ?\n");
    console.log("Sending request.....");
    if(question == 'exit'){
        break;
    }
    const response = await chat.sendMessage({
      message : question 
    })
    console.log("Response : ",response.text)
  }
}

await main();