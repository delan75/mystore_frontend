import React, { useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import axios from '../utils/axios';

/**
 * PriceDisplay component for displaying prices with accurate currency conversion
 *
 * This component fetches the converted price from the backend API and displays it.
 * It shows a synchronous approximation while loading for better UX.
 *
 * @param {number|string} price - The price in ZAR to display
 * @param {object} options - Display options
 * @param {boolean} options.showCode - Whether to show the currency code
 * @param {number} options.decimals - Number of decimal places to display
 * @param {string} options.className - Additional CSS class names
 */
const PriceDisplay = ({ price, options = {} }) => {
  const { selectedCurrency, formatPriceSync } = useCurrency();
  const [convertedPrice, setConvertedPrice] = useState(null);
  const [loading, setLoading] = useState(true);

  // Parse price to ensure it's a number
  const parsedPrice = typeof price === 'string'
    ? parseFloat(price.replace(/[^0-9.-]+/g, ''))
    : price;

  useEffect(() => {
    // Reset state when currency or price changes
    setLoading(true);
    setConvertedPrice(null);

    // Skip API call for invalid prices
    if (!selectedCurrency || isNaN(parsedPrice)) {
      setLoading(false);
      return;
    }

    // Skip API call for ZAR currency (no conversion needed)
    if (selectedCurrency.code === 'ZAR') {
      setLoading(false);
      return;
    }

    const fetchConvertedPrice = async () => {
      try {
        const response = await axios.post('/store/currencies/convert/', {
          amount: parsedPrice,
          from_currency: 'ZAR',
          to_currency: selectedCurrency.code
        });

        // Now that the backend formatting is fixed, we can use the formatted value directly
        setConvertedPrice(
          options.showCode
            ? `${response.data.converted.formatted} ${response.data.converted.currency}`
            : response.data.converted.formatted
        );
      } catch (error) {
        console.error('Failed to convert price:', error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have a valid price and non-ZAR currency
    if (parsedPrice && selectedCurrency && selectedCurrency.code !== 'ZAR') {
      fetchConvertedPrice();
    }
  }, [parsedPrice, selectedCurrency, options.showCode]);

  // If no selected currency or invalid price, show placeholder
  if (!selectedCurrency || isNaN(parsedPrice)) {
    return <span className={options.className || ''}>-</span>;
  }

  // For ZAR or while loading, use the sync formatter
  if (selectedCurrency.code === 'ZAR' || loading) {
    return (
      <span className={options.className || ''}>
        {formatPriceSync(parsedPrice, options)}
        {loading && selectedCurrency.code !== 'ZAR' && ' (converting...)'}
      </span>
    );
  }

  // Show the converted price from the API
  return (
    <span className={options.className || ''}>
      {convertedPrice}
    </span>
  );
};

export default PriceDisplay;
