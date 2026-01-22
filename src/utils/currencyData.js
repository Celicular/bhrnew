// Comprehensive country-currency mapping
export const COUNTRIES_CURRENCIES = [
  // North America
  { country: "United States", code: "US", currency: "USD", symbol: "$" },
  { country: "Canada", code: "CA", currency: "CAD", symbol: "C$" },
  { country: "Mexico", code: "MX", currency: "MXN", symbol: "$" },

  // Europe
  { country: "Austria", code: "AT", currency: "EUR", symbol: "€" },
  { country: "Belgium", code: "BE", currency: "EUR", symbol: "€" },
  { country: "Bulgaria", code: "BG", currency: "BGN", symbol: "лв" },
  { country: "Croatia", code: "HR", currency: "HRK", symbol: "kn" },
  { country: "Cyprus", code: "CY", currency: "EUR", symbol: "€" },
  { country: "Czechia", code: "CZ", currency: "CZK", symbol: "Kč" },
  { country: "Denmark", code: "DK", currency: "DKK", symbol: "kr" },
  { country: "Estonia", code: "EE", currency: "EUR", symbol: "€" },
  { country: "Finland", code: "FI", currency: "EUR", symbol: "€" },
  { country: "France", code: "FR", currency: "EUR", symbol: "€" },
  { country: "Germany", code: "DE", currency: "EUR", symbol: "€" },
  { country: "Greece", code: "GR", currency: "EUR", symbol: "€" },
  { country: "Hungary", code: "HU", currency: "HUF", symbol: "Ft" },
  { country: "Iceland", code: "IS", currency: "ISK", symbol: "kr" },
  { country: "Ireland", code: "IE", currency: "EUR", symbol: "€" },
  { country: "Italy", code: "IT", currency: "EUR", symbol: "€" },
  { country: "Latvia", code: "LV", currency: "EUR", symbol: "€" },
  { country: "Lithuania", code: "LT", currency: "EUR", symbol: "€" },
  { country: "Luxembourg", code: "LU", currency: "EUR", symbol: "€" },
  { country: "Malta", code: "MT", currency: "EUR", symbol: "€" },
  { country: "Netherlands", code: "NL", currency: "EUR", symbol: "€" },
  { country: "Poland", code: "PL", currency: "PLN", symbol: "zł" },
  { country: "Portugal", code: "PT", currency: "EUR", symbol: "€" },
  { country: "Romania", code: "RO", currency: "RON", symbol: "lei" },
  { country: "Slovakia", code: "SK", currency: "EUR", symbol: "€" },
  { country: "Slovenia", code: "SI", currency: "EUR", symbol: "€" },
  { country: "Spain", code: "ES", currency: "EUR", symbol: "€" },
  { country: "Sweden", code: "SE", currency: "SEK", symbol: "kr" },
  { country: "Switzerland", code: "CH", currency: "CHF", symbol: "CHF" },
  { country: "United Kingdom", code: "GB", currency: "GBP", symbol: "£" },
  { country: "Norway", code: "NO", currency: "NOK", symbol: "kr" },
  { country: "Russia", code: "RU", currency: "RUB", symbol: "₽" },
  { country: "Ukraine", code: "UA", currency: "UAH", symbol: "₴" },
  { country: "Serbia", code: "RS", currency: "RSD", symbol: "дин" },

  // Asia
  { country: "Afghanistan", code: "AF", currency: "AFN", symbol: "؋" },
  { country: "Armenia", code: "AM", currency: "AMD", symbol: "֏" },
  { country: "Azerbaijan", code: "AZ", currency: "AZN", symbol: "₼" },
  { country: "Bahrain", code: "BH", currency: "BHD", symbol: ".د.ب" },
  { country: "Bangladesh", code: "BD", currency: "BDT", symbol: "৳" },
  { country: "Bhutan", code: "BT", currency: "BTN", symbol: "Nu." },
  { country: "Cambodia", code: "KH", currency: "KHR", symbol: "៛" },
  { country: "China", code: "CN", currency: "CNY", symbol: "¥" },
  { country: "Georgia", code: "GE", currency: "GEL", symbol: "₾" },
  { country: "Hong Kong", code: "HK", currency: "HKD", symbol: "HK$" },
  { country: "India", code: "IN", currency: "INR", symbol: "₹" },
  { country: "Indonesia", code: "ID", currency: "IDR", symbol: "Rp" },
  { country: "Iran", code: "IR", currency: "IRR", symbol: "﷼" },
  { country: "Iraq", code: "IQ", currency: "IQD", symbol: "ع.د" },
  { country: "Israel", code: "IL", currency: "ILS", symbol: "₪" },
  { country: "Japan", code: "JP", currency: "JPY", symbol: "¥" },
  { country: "Jordan", code: "JO", currency: "JOD", symbol: "د.ا" },
  { country: "Kazakhstan", code: "KZ", currency: "KZT", symbol: "₸" },
  { country: "Kuwait", code: "KW", currency: "KWD", symbol: "د.ك" },
  { country: "Kyrgyzstan", code: "KG", currency: "KGS", symbol: "с" },
  { country: "Laos", code: "LA", currency: "LAK", symbol: "₭" },
  { country: "Lebanon", code: "LB", currency: "LBP", symbol: "ل.ل" },
  { country: "Macau", code: "MO", currency: "MOP", symbol: "P" },
  { country: "Malaysia", code: "MY", currency: "MYR", symbol: "RM" },
  { country: "Maldives", code: "MV", currency: "MVR", symbol: "Rf" },
  { country: "Mongolia", code: "MN", currency: "MNT", symbol: "₮" },
  { country: "Myanmar", code: "MM", currency: "MMK", symbol: "K" },
  { country: "Nepal", code: "NP", currency: "NPR", symbol: "₨" },
  { country: "North Korea", code: "KP", currency: "KPW", symbol: "₩" },
  { country: "Oman", code: "OM", currency: "OMR", symbol: "ر.ع." },
  { country: "Pakistan", code: "PK", currency: "PKR", symbol: "₨" },
  { country: "Palestine", code: "PS", currency: "ILS", symbol: "₪" },
  { country: "Philippines", code: "PH", currency: "PHP", symbol: "₱" },
  { country: "Qatar", code: "QA", currency: "QAR", symbol: "ر.ق" },
  { country: "Saudi Arabia", code: "SA", currency: "SAR", symbol: "﷼" },
  { country: "Singapore", code: "SG", currency: "SGD", symbol: "S$" },
  { country: "South Korea", code: "KR", currency: "KRW", symbol: "₩" },
  { country: "Sri Lanka", code: "LK", currency: "LKR", symbol: "₨" },
  { country: "Syria", code: "SY", currency: "SYP", symbol: "£" },
  { country: "Taiwan", code: "TW", currency: "TWD", symbol: "NT$" },
  { country: "Tajikistan", code: "TJ", currency: "TJS", symbol: "ЅМ" },
  { country: "Thailand", code: "TH", currency: "THB", symbol: "฿" },
  { country: "Timor-Leste", code: "TL", currency: "USD", symbol: "$" },
  { country: "Turkey", code: "TR", currency: "TRY", symbol: "₺" },
  { country: "Turkmenistan", code: "TM", currency: "TMT", symbol: "m" },
  { country: "United Arab Emirates", code: "AE", currency: "AED", symbol: "د.إ" },
  { country: "Uzbekistan", code: "UZ", currency: "UZS", symbol: "so'm" },
  { country: "Vietnam", code: "VN", currency: "VND", symbol: "₫" },
  { country: "Yemen", code: "YE", currency: "YER", symbol: "﷼" },

  // Africa
  { country: "Algeria", code: "DZ", currency: "DZD", symbol: "د.ج" },
  { country: "Angola", code: "AO", currency: "AOA", symbol: "Kz" },
  { country: "Benin", code: "BJ", currency: "XOF", symbol: "Fr" },
  { country: "Botswana", code: "BW", currency: "BWP", symbol: "P" },
  { country: "Burkina Faso", code: "BF", currency: "XOF", symbol: "Fr" },
  { country: "Burundi", code: "BI", currency: "BIF", symbol: "FBu" },
  { country: "Cameroon", code: "CM", currency: "XAF", symbol: "Fr" },
  { country: "Cape Verde", code: "CV", currency: "CVE", symbol: "$" },
  { country: "Central African Republic", code: "CF", currency: "XAF", symbol: "Fr" },
  { country: "Chad", code: "TD", currency: "XAF", symbol: "Fr" },
  { country: "Comoros", code: "KM", currency: "KMF", symbol: "Fr" },
  { country: "Congo", code: "CG", currency: "XAF", symbol: "Fr" },
  { country: "Democratic Republic of the Congo", code: "CD", currency: "CDF", symbol: "Fr" },
  { country: "Djibouti", code: "DJ", currency: "DJF", symbol: "Fr" },
  { country: "Egypt", code: "EG", currency: "EGP", symbol: "£" },
  { country: "Equatorial Guinea", code: "GQ", currency: "XAF", symbol: "Fr" },
  { country: "Eritrea", code: "ER", currency: "ERN", symbol: "Nfk" },
  { country: "Eswatini", code: "SZ", currency: "SZL", symbol: "L" },
  { country: "Ethiopia", code: "ET", currency: "ETB", symbol: "Br" },
  { country: "Gabon", code: "GA", currency: "XAF", symbol: "Fr" },
  { country: "Gambia", code: "GM", currency: "GMD", symbol: "D" },
  { country: "Ghana", code: "GH", currency: "GHS", symbol: "₵" },
  { country: "Guinea", code: "GN", currency: "GNF", symbol: "Fr" },
  { country: "Guinea-Bissau", code: "GW", currency: "XOF", symbol: "Fr" },
  { country: "Ivory Coast", code: "CI", currency: "XOF", symbol: "Fr" },
  { country: "Kenya", code: "KE", currency: "KES", symbol: "KSh" },
  { country: "Lesotho", code: "LS", currency: "LSL", symbol: "L" },
  { country: "Liberia", code: "LR", currency: "LRD", symbol: "$" },
  { country: "Libya", code: "LY", currency: "LYD", symbol: "ل.د" },
  { country: "Madagascar", code: "MG", currency: "MGA", symbol: "Ar" },
  { country: "Malawi", code: "MW", currency: "MWK", symbol: "MK" },
  { country: "Mali", code: "ML", currency: "XOF", symbol: "Fr" },
  { country: "Mauritania", code: "MR", currency: "MRU", symbol: "UM" },
  { country: "Mauritius", code: "MU", currency: "MUR", symbol: "₨" },
  { country: "Morocco", code: "MA", currency: "MAD", symbol: "د.م." },
  { country: "Mozambique", code: "MZ", currency: "MZN", symbol: "MT" },
  { country: "Namibia", code: "NA", currency: "NAD", symbol: "$" },
  { country: "Niger", code: "NE", currency: "XOF", symbol: "Fr" },
  { country: "Nigeria", code: "NG", currency: "NGN", symbol: "₦" },
  { country: "Rwanda", code: "RW", currency: "RWF", symbol: "Fr" },
  { country: "Sao Tome and Principe", code: "ST", currency: "STN", symbol: "Db" },
  { country: "Senegal", code: "SN", currency: "XOF", symbol: "Fr" },
  { country: "Seychelles", code: "SC", currency: "SCR", symbol: "₨" },
  { country: "Sierra Leone", code: "SL", currency: "SLL", symbol: "Le" },
  { country: "Somalia", code: "SO", currency: "SOS", symbol: "Sh" },
  { country: "South Africa", code: "ZA", currency: "ZAR", symbol: "R" },
  { country: "South Sudan", code: "SS", currency: "SSP", symbol: "£" },
  { country: "Sudan", code: "SD", currency: "SDG", symbol: "ج.س" },
  { country: "Togo", code: "TG", currency: "XOF", symbol: "Fr" },
  { country: "Tunisia", code: "TN", currency: "TND", symbol: "د.ت" },
  { country: "Uganda", code: "UG", currency: "UGX", symbol: "USh" },
  { country: "Zambia", code: "ZM", currency: "ZMW", symbol: "ZK" },
  { country: "Zimbabwe", code: "ZW", currency: "ZWL", symbol: "$" },

  // Oceania
  { country: "Australia", code: "AU", currency: "AUD", symbol: "A$" },
  { country: "Fiji", code: "FJ", currency: "FJD", symbol: "FJ$" },
  { country: "Kiribati", code: "KI", currency: "AUD", symbol: "A$" },
  { country: "Marshall Islands", code: "MH", currency: "USD", symbol: "$" },
  { country: "Micronesia", code: "FM", currency: "USD", symbol: "$" },
  { country: "Nauru", code: "NR", currency: "AUD", symbol: "A$" },
  { country: "New Zealand", code: "NZ", currency: "NZD", symbol: "NZ$" },
  { country: "Palau", code: "PW", currency: "USD", symbol: "$" },
  { country: "Papua New Guinea", code: "PG", currency: "PGK", symbol: "K" },
  { country: "Samoa", code: "WS", currency: "WST", symbol: "T" },
  { country: "Solomon Islands", code: "SB", currency: "SBD", symbol: "$" },
  { country: "Tonga", code: "TO", currency: "TOP", symbol: "T$" },
  { country: "Tuvalu", code: "TV", currency: "AUD", symbol: "A$" },
  { country: "Vanuatu", code: "VU", currency: "VUV", symbol: "VT" },

  // South America
  { country: "Argentina", code: "AR", currency: "ARS", symbol: "$" },
  { country: "Bolivia", code: "BO", currency: "BOB", symbol: "Bs." },
  { country: "Brazil", code: "BR", currency: "BRL", symbol: "R$" },
  { country: "Chile", code: "CL", currency: "CLP", symbol: "$" },
  { country: "Colombia", code: "CO", currency: "COP", symbol: "$" },
  { country: "Ecuador", code: "EC", currency: "USD", symbol: "$" },
  { country: "Guyana", code: "GY", currency: "GYD", symbol: "$" },
  { country: "Paraguay", code: "PY", currency: "PYG", symbol: "₲" },
  { country: "Peru", code: "PE", currency: "PEN", symbol: "S/" },
  { country: "Suriname", code: "SR", currency: "SRD", symbol: "$" },
  { country: "Uruguay", code: "UY", currency: "UYU", symbol: "$U" },
  { country: "Venezuela", code: "VE", currency: "VES", symbol: "Bs" },

  // Central America & Caribbean
  { country: "Antigua and Barbuda", code: "AG", currency: "XCD", symbol: "$" },
  { country: "Bahamas", code: "BS", currency: "BSD", symbol: "$" },
  { country: "Barbados", code: "BB", currency: "BBD", symbol: "$" },
  { country: "Belize", code: "BZ", currency: "BZD", symbol: "BZ$" },
  { country: "Costa Rica", code: "CR", currency: "CRC", symbol: "₡" },
  { country: "Cuba", code: "CU", currency: "CUP", symbol: "₱" },
  { country: "Dominica", code: "DM", currency: "XCD", symbol: "$" },
  { country: "Dominican Republic", code: "DO", currency: "DOP", symbol: "RD$" },
  { country: "El Salvador", code: "SV", currency: "SVC", symbol: "₡" },
  { country: "Grenada", code: "GD", currency: "XCD", symbol: "$" },
  { country: "Guatemala", code: "GT", currency: "GTQ", symbol: "Q" },
  { country: "Haiti", code: "HT", currency: "HTG", symbol: "G" },
  { country: "Honduras", code: "HN", currency: "HNL", symbol: "L" },
  { country: "Jamaica", code: "JM", currency: "JMD", symbol: "J$" },
  { country: "Nicaragua", code: "NI", currency: "NIO", symbol: "C$" },
  { country: "Panama", code: "PA", currency: "PAB", symbol: "B/." },
  { country: "Saint Kitts and Nevis", code: "KN", currency: "XCD", symbol: "$" },
  { country: "Saint Lucia", code: "LC", currency: "XCD", symbol: "$" },
  { country: "Saint Vincent and the Grenadines", code: "VC", currency: "XCD", symbol: "$" },
  { country: "Trinidad and Tobago", code: "TT", currency: "TTD", symbol: "TT$" },

  // Middle East & North Africa
  { country: "Morocco", code: "MA", currency: "MAD", symbol: "د.م." },
  { country: "Tunisia", code: "TN", currency: "TND", symbol: "د.ت" },
];

// Remove duplicates by keeping only the first occurrence
export const UNIQUE_COUNTRIES = (() => {
  const seen = new Set();
  return COUNTRIES_CURRENCIES.filter((item) => {
    if (seen.has(item.country)) return false;
    seen.add(item.country);
    return true;
  });
})();

// Get all unique currencies
export const ALL_CURRENCIES = (() => {
  const seen = new Set();
  return COUNTRIES_CURRENCIES.filter((item) => {
    if (seen.has(item.currency)) return false;
    seen.add(item.currency);
    return true;
  }).sort((a, b) => a.currency.localeCompare(b.currency));
})();

// Helper functions
export const getCurrenciesByCountry = (country) => {
  const items = COUNTRIES_CURRENCIES.filter((item) => item.country === country);
  return items.map((item) => ({
    currency: item.currency,
    symbol: item.symbol,
  }));
};

export const getCountriesByCurrency = (currency) => {
  return COUNTRIES_CURRENCIES.filter((item) => item.currency === currency).map(
    (item) => item.country
  );
};

export const getCurrencySymbol = (currency) => {
  const item = COUNTRIES_CURRENCIES.find((item) => item.currency === currency);
  return item?.symbol || "$";
};

// Fetch exchange rates from free API with caching
let exchangeRatesCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const getExchangeRates = async () => {
  try {
    // Check if cache is still valid
    if (exchangeRatesCache && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
      return exchangeRatesCache;
    }

    // Fetch from exchangerate-api.com (free tier: 1500 requests/month)
    const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    
    if (!response.ok) throw new Error("Failed to fetch exchange rates");
    
    const data = await response.json();
    
    // Cache the rates
    exchangeRatesCache = data.rates;
    cacheTimestamp = Date.now();
    
    // Also store in localStorage for persistence
    localStorage.setItem("exchangeRates", JSON.stringify(data.rates));
    localStorage.setItem("exchangeRatesTimestamp", cacheTimestamp.toString());
    
    return data.rates;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    
    // Try to use cached rates from localStorage
    const cached = localStorage.getItem("exchangeRates");
    if (cached) {
      exchangeRatesCache = JSON.parse(cached);
      return exchangeRatesCache;
    }
    
    // Fallback: return empty object (rates will default to 1)
    return {};
  }
};

// Get rate for a specific currency (will fetch from cache/API)
export const getCurrencyRate = async (currency) => {
  const rates = await getExchangeRates();
  return rates[currency] || 1;
};

// Convert price using fetched rates
export const convertPrice = async (priceInUSD, currency) => {
  const rate = await getCurrencyRate(currency);
  return Math.round(priceInUSD * rate * 100) / 100;
};
