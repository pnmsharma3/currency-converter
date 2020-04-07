import React from 'react';
const CurrencyRow = (props) => {
    const {currencyOptions, currency,amount,onChangeAmount,onChangeCurrency,currencyNames} =props
    return ( 
        <div className="currency-row">
            <input type="number" className="currency-input" value={amount} onChange={onChangeAmount}></input>
            <select  value={currency} onChange={onChangeCurrency}>
                {currencyOptions.map(option=><option key={option}value={option}>{currencyNames[option] }</option>)}
            </select>
        </div>
     );
}
 
export default CurrencyRow;