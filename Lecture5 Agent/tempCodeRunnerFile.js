// Crypto Currency Tool 
async function cryptoCurrency({coin}){
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${coin}`); 
    const data = await response.json();
    console.log(data);
    return data;
}
cryptoCurrency({coin : "ethereum"});