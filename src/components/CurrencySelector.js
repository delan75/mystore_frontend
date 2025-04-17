import React from 'react';
import { useCurrency } from '../context/CurrencyContext';
import '../styles/CurrencySelector.css';

const CurrencySelector = () => {
  const { currencies, selectedCurrency, setSelectedCurrency, loading } = useCurrency();

  // If loading or no selected currency yet, show loading state
  if (loading || !selectedCurrency) {
    return (
      <div className="currency-selector">
        <div className="currency-loading">Loading...</div>
      </div>
    );
  }

  const handleCurrencyChange = (e) => {
    const currencyCode = e.target.value;
    const currency = currencies.find(c => c.code === currencyCode);
    if (currency) {
      setSelectedCurrency(currency);
    }
  };

  return (
    <div className="currency-selector">
      <select
        value={selectedCurrency.code}
        onChange={handleCurrencyChange}
        className="currency-select"
        aria-label="Select Currency"
      >
        {currencies.map(currency => (
          <option key={currency.code} value={currency.code}>
            {currency.code} ({currency.symbol})
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySelector;
