// App.js

import "./App.css";

import React, { useEffect, useState } from "react";

import ChartComponent from "./ChartComponent";

const App = () => {
  const [selectedCoins, setSelectedCoins] = useState([]);
  const [coinData, setCoinData] = useState({});
  const [userPreferences, setUserPreferences] = useState({});

  // Fetch data for selected coins
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = {};
        for (const coin of selectedCoins) {
          const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=30`
          );
          const json = await response.json();
          const formattedData = json.prices.reduce(
            (acc, [timestamp, price]) => {
              const date = new Date(timestamp);
              const dateString = date.toISOString().split("T")[0];
              if (!acc[dateString]) {
                acc[dateString] = {
                  open: price,
                  close: price,
                  high: price,
                  low: price,
                };
              } else {
                acc[dateString].close = price;
                acc[dateString].high = Math.max(acc[dateString].high, price);
                acc[dateString].low = Math.min(acc[dateString].low, price);
              }
              return acc;
            },
            {}
          );
          fetchedData[coin] = formattedData;
        }
        setCoinData(fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedCoins]);

  const togglePreference = (coin, preference) => {
    const currentPreferences = userPreferences[coin] || [];
    const isPreferenceIncluded = currentPreferences.includes(preference);
    let updatedPreferences;
    if (isPreferenceIncluded) {
      updatedPreferences = currentPreferences.filter(pref => pref !== preference);
    } else {
      updatedPreferences = [...currentPreferences, preference];
    }

    setUserPreferences(prevPreferences => ({
      ...prevPreferences,
      [coin]: updatedPreferences,
    }));
  };
  
  useEffect(() => {
    // Set the first preference checkbox checked initially for each selected coin
    const initialPreferences = {};
    selectedCoins.forEach(coin => {
      initialPreferences[coin] = ['open']; // Selecting 'open' preference by default
    });
    setUserPreferences(initialPreferences);
  }, [selectedCoins]);

  return (
    <div className="App">
      <h1>Crypto Price Viewer</h1>
      <div>
        <div>
          <p>Select any coin...</p>
          <select
            value={selectedCoins}
            onChange={(e) =>
              setSelectedCoins(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
            multiple
          >
            <option value="bitcoin">Bitcoin</option>
            <option value="ethereum">Ethereum</option>
            <option value="0xblack">0xblack</option>
          </select>
        </div>

      </div>
      {selectedCoins.map((coin) => (
        <div key={coin} className="chartWrapper">
          <h2>{coin.toUpperCase()} Price Chart</h2>
          <ChartComponent
            data={coinData[coin]}
            preferences={userPreferences[coin] || []}
          />
          <div>
            <p>Select preferences...</p>
            {['open', 'high', 'low', 'close'].map(preference => (
              <label key={preference}>
                {preference.charAt(0).toUpperCase() + preference.slice(1)}
                <input
                  type="checkbox"
                  checked={userPreferences[coin] && userPreferences[coin].includes(preference)}
                  onChange={() => togglePreference(coin, preference)}
                />
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
