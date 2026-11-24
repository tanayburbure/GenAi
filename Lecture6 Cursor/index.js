import { GoogleGenAI, Type } from "@google/genai";
import { exec } from "child_process";
import readlineSync from "readline-sync";
import "dotenv/config";
import util from "util";
import os from "os";

const platform = os.platform();
const execute = util.promisify(exec);

//configure the client
const ai = new GoogleGenAI({});

//tool
async function executeCommand({ command }) {
  try {
    const { stdout, stderr } = await execute(command);
    if (stderr) {
      return `Error : ${stderr}`;
    }
    return `Success : ${stdout}`;
  } catch (err) {
    return `Error : ${err}`;
  }
}

const commandExecuter = {
  name: "executeCommand",
  description:
    "It takes any shell/terminal command and execute it. It will help us to create,read,write,update,delete",
  parameters: {
    type: Type.OBJECT,
    properties: {
      command: {
        type: Type.STRING,
        description:
          "It is the termial/shell command. Ex : mkdir calculator,touch calculator/index.js etc",
      },
    },
    required: ["command"],
  },
};

const History = [];

async function buildWebsite() {
  while (true) {
    const result = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: History,
      config: {
        systemInstruction: `You are a website builder,which will create the frontend part of the website using terminal/shell command. You will give shell/terminal command one by one and our tool will execute it.
        Give the command according to the operating system we are using .
        My current user operating system is : ${platform}.
        Kindly use best practice for commands, it should handle multiline write also efficiently .
        Your job
          1.Analyze the user query
          2.Take the neccessary action after the analysing the query by giving proper shell/terminal command according to the user operating system

          Step By Step Guide
          1: First you have to create the folder for the website which we have to create, ex: mkdir calculator
          2: Give shell/terminal command to create html file , ex: touch calculator/index.html
          3: Give shell/terminal command to create CSS file 
          4: Give shell/terminal command to create Javascript file 
          5: Give shell/terminal command to write on html file 
          6: Give shell/terminal command to write on css file 
          7: Give shell/terminal command to write on javascript file
          8: fix the error if they are persent at any step by writing, update or deleting

      For Windows, write multi-line HTML like this:

        echo ^<!DOCTYPE html^> > calculator\\index.html
        echo ^<html^> >> calculator\\index.html
        echo ^<head^> >> calculator\\index.html
        echo   ^<title^>Calculator^</title^> >> calculator\\index.html
        echo   ^<link rel="stylesheet" href="style.css"^> >> calculator\\index.html
        echo ^</head^> >> calculator\\index.html
        echo ^<body^> >> calculator\\index.html
        echo   ^<div id="calculator"^>^</div^> >> calculator\\index.html
        echo   ^<script src="script.js"^>^</script^> >> calculator\\index.html
        echo ^</body^> >> calculator\\index.html
        echo ^</html^> >> calculator\\index.html
            

        For Mac/Linux, write multi-line HTML like this:

        cat > calculator/index.html << 'EOF'
        <!DOCTYPE html>
        <html>
        <head>
        <title>Calculator</title>
        <link rel="stylesheet" href="style.css">
        </head>
        <body>
        <div id="calculator"></div>
        <script src="script.js"></script>
        </body>
        </html>
        EOF


                
                `,
        tools: [
          {
            functionDeclaration: [commandExecuter],
          },
        ],
      },
    });
    if (result.functionCalls && result.functionCalls.length > 0) {
      const functionCall = result.functionCalls[0];
      const { name, args } = functionCall;
      const toolResponse = await executeCommand(args);

      const functionResponsePart = {
        name: functionCall.name,
        response: {
          result: toolResponse,
        },
      };

      //send the function response back to the model.
      History.push({
        role: "model",
        parts: [
          {
            functionCall: functionCall,
          },
        ],
      });

      History.push({
        role: "user",
        parts: [
          {
            functionResponse: functionResponsePart,
          },
        ],
      });
    } else {
      break;
      console.log(result.text);
      History.push({
        role: "model",
        parts: [{ text: result.text }],
      });
    }
  }
}

while (true) {
  const question = readlineSync.question("Ask me anything -->  ");
  if (question == "exit") {
    break;
  }
  History.push({
    role: "user",
    parts: [{ text: question }],
  });

  await buildWebsite();
}
