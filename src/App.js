import React, { useEffect, useState } from 'react';
import CurrencyRow from './CurrencyRow';
import './App.scss';
const EXCHANGE_URL = 'https://api.exchangeratesapi.io/latest';
const CURRENCY_NAME_URL='https://restcountries.eu/rest/v2/all?fields=currencies'


function App() {
  const [options, setOption] = useState([]),
    [fromCurrency, setFromCurrency] = useState(),
    [toCurrency, setToCurrency] = useState(),
    [exchangeRate, setExchangeRate] = useState(),
    [amount, setAmount] = useState(1),
    [isFromCurrency, setIsFromCurrency] = useState(true),
    [currencyNames, setCurrencyNames] = useState();

    let toAmount, fromAmount
    if (isFromCurrency) {
      fromAmount = amount
      toAmount = amount * exchangeRate
    } else {
      toAmount = amount
      fromAmount = amount / exchangeRate
    }
  
  // Api call on intial load
  useEffect(() => {
    fetch(CURRENCY_NAME_URL)
    .then(res=>res.json())
    .then(data=>{
      let countryDetails=data.reduce((acc,curr)=>{
      let a = {[curr.currencies[0].code]:curr.currencies[0].name  }
      return {...acc,...a}
    },{});
    setCurrencyNames(countryDetails);
   
  })
      
    // get currency exchange rates
    fetch(EXCHANGE_URL).then(res => res.json()).then(data => {
   
      setOption([data.base, ...Object.keys(data.rates)].sort())
      setFromCurrency(data.base)
      setToCurrency(Object.keys(data.rates)[0])
      setExchangeRate(data.rates[Object.keys(data.rates)[0]])
    })
  },[]);

  // Api call on every currency change
  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      fetch(`${EXCHANGE_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
        .then(res => res.json())
        .then(data => setExchangeRate(data.rates[toCurrency]))
    }
  }, [fromCurrency, toCurrency])



  let handleAmountChange = (value, isFromCurrency) => {
    setAmount(value);
    setIsFromCurrency(isFromCurrency)
  }

  return (
    <div className="currency-converter">
     {!!currencyNames?
     <>
      <div>
        {fromAmount} {currencyNames[fromCurrency]} equals
        <h2> {toAmount} {currencyNames[toCurrency]} </h2>
        
      </div>
   <p>{ Date()}</p>
      
  
      <CurrencyRow
        currencyNames={currencyNames}
        currencyOptions={options}
        currency={fromCurrency}
        amount={fromAmount}
        onChangeAmount={(e) => handleAmountChange(e.target.value, true)}
        onChangeCurrency={(e) => setFromCurrency(e.target.value)}
      />
      <CurrencyRow
        currencyNames={currencyNames}
        currencyOptions={options}
        currency={toCurrency}
        amount={toAmount}
        onChangeAmount={(e) => handleAmountChange(e.target.value, false)}
        onChangeCurrency={(e) => setToCurrency(e.target.value)}
      />
       </>
      :''}
    </div>
  );
}

export default App;
