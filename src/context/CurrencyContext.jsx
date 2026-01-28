import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getCurrencySymbol, convertPrice } from "@/utils/currencyData";
import { api } from "@/utils/client";

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [country, setCountry] = useState(() => {
    return localStorage.getItem("selectedCountry") || "United States";
  });

  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem("selectedCurrency") || "USD";
  });

  const [exchangeRates, setExchangeRates] = useState({});
  const [isLoadingRates, setIsLoadingRates] = useState(false);

  // Fetch exchange rates on component mount
  useEffect(() => {
    const fetchRates = async () => {
      setIsLoadingRates(true);
      try {
        const response = await api.getExchangeRates();
        if (response.status === 200) {
          const data = response.data;
          setExchangeRates(data.rates);
          localStorage.setItem("exchangeRates", JSON.stringify(data.rates));
        }
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
        // Try to use cached rates
        const cached = localStorage.getItem("exchangeRates");
        if (cached) {
          setExchangeRates(JSON.parse(cached));
        }
      }
      setIsLoadingRates(false);
    };

    fetchRates();
  }, []);

  // Persist to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("selectedCountry", country);
  }, [country]);

  useEffect(() => {
    localStorage.setItem("selectedCurrency", currency);
  }, [currency]);

  const convertPriceSync = useCallback(
    (priceInUSD) => {
      const rate = exchangeRates[currency] || 1;
      return Math.round(priceInUSD * rate * 100) / 100;
    },
    [currency, exchangeRates],
  );

  const value = {
    country,
    setCountry,
    currency,
    setCurrency,
    symbol: getCurrencySymbol(currency),
    convertPrice: convertPriceSync,
    isLoadingRates,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return context;
}
