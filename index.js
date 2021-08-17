const axios = require('axios');

// https://fixer.io/
const FIXER_API_KEY = 'd19f4435af7257250b37fb35c3047663';
const FIXER_API = `http://data.fixer.io/api/latest?access_key=${FIXER_API_KEY}`;

// https://restcountries.eu
const REST_COUNTRIES_API = `https://restcountries.eu/rest/v2/currency`;

//Fetch data about currencies

const getExchangeRate = async (fromCurrency, toCurrency) => {

    try {
        const  { data: {rates} } = await axios.get(FIXER_API);

        const euro = 1/rates[fromCurrency]; 
        const exchangeRate = euro*rates[toCurrency]; 
    
        return exchangeRate;
    } catch (error) {
        throw new Error(`Unable to get currency from ${fromCurrency} and ${toCurrency}`);
    }
}

const getCountries = async (currencyCode) => {
    try {
        const {data} = await axios.get(`${REST_COUNTRIES_API}/${currencyCode}`);

        return data.map(({ name }) => name); 
        
    } catch (error) {
        throw new Error(`Unable to get countries that use ${currencyCode}.`);
        
    }
    
}


const convertCurrency = async (fromCurrency, toCurrency, amount) => {
    fromCurrency = fromCurrency.toUpperCase();
    toCurrency = toCurrency.toUpperCase();

    const [exchangeRate, countries] = await Promise.all([
        getExchangeRate(fromCurrency, toCurrency),
        getCountries(toCurrency),
    ]);

    const convertedAmount = (amount*exchangeRate).toFixed(2);
    
    return(
        `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}.
        You can spend these in the following countries: ${countries}.`
    );

}

convertCurrency('AUD', 'EUR', 20)
    .then((result) => console.log(result))
    .catch((error) => console.log(error));


