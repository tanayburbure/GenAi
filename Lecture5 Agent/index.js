import { GoogleGenAI, Type } from '@google/genai';
import readlineSync from "readline-sync"
import 'dotenv/config'

// Crypto Currency Tool 
async function cryptoCurrency({coin}){
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${coin}`); 
    const data = await response.json();
    // console.log(data);
    return data;
}
// cryptoCurrency({coin : "ethereum"});

//Weather Tool
async function weatherInformation({city}){
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=d6a3bcd7a43c4ed59c2155208252404&q=${city}&aqi=no`);
    const data = (await response).json();
    return data ;
}

const cryptoInfo = {
    name : "cryptoCurrency" ,
    description : "we can give you the current price and the information related to cryptocurrency like bitcoin or ethereum etc",
    parameters : {
        type : Type.OBJECT,
        properties : {
            coin : {
                type : Type.STRING,
                description : "It will be the name of cryptocurrency like bitcoin,ethereum, etc"
            }
        },
        required : ['coin']
    }
}

const weatherInfo = {
    name : "weatherInformation",
    description : "you can get the current weather information of any city like london,goa, etc",
    parameters : {
        type : Type.OBJECT,
        properties : {
            city : {
                type :Type.STRING ,
                description : "Name of the city for which i have to fetch weather information like london,goa,etc"
            }
        },
        required : ['city']
    }
}

const tools = [{
    functionDeclarations : [cryptoInfo,weatherInfo]
}];

const toolFunctions = {
    "cryptoCurrency" : cryptoCurrency,
    "weatherInformation" : weatherInformation
}

const History = [] ;

async function runAgent(){

}

while(true){

}