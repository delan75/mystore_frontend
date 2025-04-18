import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../utils/axios';

// Create the Currency context
const CurrencyContext = createContext();

// Create a hook to use the currency context
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

// Create the Currency provider component
export const CurrencyProvider = ({ children }) => {
  // State for available currencies
  const [currencies, setCurrencies] = useState([]);

  // State for the selected currency
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  // State for loading status
  const [loading, setLoading] = useState(true);

  // Fetch default currency from the backend
  const fetchDefaultCurrency = async () => {
    try {
      const response = await axios.get('/store/currencies/default/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch default currency:', error);
      // Fallback to ZAR if API fails
      return {
        code: 'ZAR',
        name: 'South African Rand',
        symbol: 'R',
        exchange_rate: 1,
        is_default: true,
        is_active: true
      };
    }
  };

  // Fetch currencies from the backend
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setLoading(true);

        // Use fallback currency if API fails
        const fallbackCurrency = {
          code: 'ZAR',
          name: 'South African Rand',
          symbol: 'R',
          exchange_rate: 1,
          is_default: true,
          is_active: true
        };

        // Fetch all active currencies
        const currenciesResponse = await axios.get('/store/currencies/');
        setCurrencies(currenciesResponse.data);

        // Get default currency from backend
        const defaultCurrency = await fetchDefaultCurrency();

        // Check if there's a saved preference
        const savedCurrencyCode = localStorage.getItem('selectedCurrency');
        if (savedCurrencyCode) {
          const savedCurrency = currenciesResponse.data.find(c => c.code === savedCurrencyCode);
          if (savedCurrency && savedCurrency.is_active) {
            setSelectedCurrency(savedCurrency);
          } else {
            setSelectedCurrency(defaultCurrency);
          }
        } else {
          setSelectedCurrency(defaultCurrency);
        }
      } catch (error) {
        console.error('Failed to fetch currencies:', error);
        // Fallback to ZAR if API fails
        const fallbackCurrency = {
          code: 'ZAR',
          name: 'South African Rand',
          symbol: 'R',
          exchange_rate: 1,
          is_default: true,
          is_active: true
        };
        setCurrencies([fallbackCurrency]);
        setSelectedCurrency(fallbackCurrency);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  // Save selected currency to localStorage when it changes
  useEffect(() => {
    if (selectedCurrency) {
      localStorage.setItem('selectedCurrency', selectedCurrency.code);
    }
  }, [selectedCurrency]);

  // Function to format price using the backend API
  const formatPrice = async (priceInZAR, options = {}) => {
    if (!selectedCurrency) return 'Loading...';

    // Parse the price to ensure it's a number
    const price = typeof priceInZAR === 'string'
      ? parseFloat(priceInZAR.replace(/[^0-9.-]+/g, ''))
      : priceInZAR;

    if (isNaN(price)) return `${selectedCurrency.symbol}0.00`;

    // If price is 0, return formatted zero
    if (price === 0) return `${selectedCurrency.symbol}0.00`;

    // If selected currency is ZAR and we're in a hurry, format it directly
    if (selectedCurrency.code === 'ZAR') {
      const formattedPrice = price.toFixed(2);
      return options.showCode
        ? `${selectedCurrency.symbol}${formattedPrice} ${selectedCurrency.code}`
        : `${selectedCurrency.symbol}${formattedPrice}`;
    }

    try {
      // Use the backend API for conversion and formatting
      const response = await axios.post('/store/currencies/convert/', {
        amount: price,
        from_currency: 'ZAR',
        to_currency: selectedCurrency.code
      });

      return options.showCode
        ? `${response.data.converted.formatted} ${response.data.converted.currency}`
        : response.data.converted.formatted;
    } catch (error) {
      console.error('Price formatting failed:', error);
      // Simple fallback formatting if API fails
      const formattedPrice = price.toFixed(2);
      return `${selectedCurrency.symbol}${formattedPrice}`;
    }
  };

  // Synchronous version for immediate display (less accurate but faster)
  const formatPriceSync = (priceInZAR, options = {}) => {
    if (!selectedCurrency) return 'Loading...';

    // Parse the price to ensure it's a number
    const price = typeof priceInZAR === 'string'
      ? parseFloat(priceInZAR.replace(/[^0-9.-]+/g, ''))
      : priceInZAR;

    if (isNaN(price)) return `${selectedCurrency.symbol}0.00`;

    // Format options
    const { showCode = false, decimals = 2 } = options;

    // For ZAR, no conversion needed
    if (selectedCurrency.code === 'ZAR') {
      const formattedPrice = price.toFixed(decimals);
      return showCode
        ? `${selectedCurrency.symbol}${formattedPrice} ${selectedCurrency.code}`
        : `${selectedCurrency.symbol}${formattedPrice}`;
    }

    // For other currencies, provide a rough approximation based on exchange rate
    // This is just for immediate display while the API call is in progress
    // The actual accurate conversion will come from the backend API
    let approximateAmount = price;

    // If we have an exchange rate, use it for a rough approximation
    if (selectedCurrency.exchange_rate) {
      // Convert based on the exchange rate definition in the backend
      approximateAmount = price * selectedCurrency.exchange_rate;
    }

    const formattedPrice = approximateAmount.toFixed(decimals);

    return showCode
      ? `${selectedCurrency.symbol}${formattedPrice} ${selectedCurrency.code}`
      : `${selectedCurrency.symbol}${formattedPrice}`;
  };

  // Create the context value
  const contextValue = {
    currencies,
    selectedCurrency,
    setSelectedCurrency,
    formatPrice,        // Async function that uses the API
    formatPriceSync,    // Sync function for immediate display
    loading
  };

  // Provide the context value to children
  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
};
