// App.js

import "./App.css";

import React, { useEffect, useState } from "react";

import ChartComponent from "./ChartComponent";

const CryptoPriceChartSDK = ({coins}) => {
  const [selectedCoins, setSelectedCoins] = useState([]);
  const [coinData, setCoinData] = useState({});
  const [userPreferences, setUserPreferences] = useState({});

  // // Load user preferences from local storage
  // useEffect(() => {
  //   // Set the first preference checkbox checked initially for each selected coin
  //   const initialPreferences = {};
  //   selectedCoins.forEach(coin => {
  //     initialPreferences[coin] = ['open']; // Selecting 'open' preference by default
  //   });
  //   setUserPreferences(initialPreferences);
  // }, [selectedCoins]);
  
  useEffect(() => {
    const storedPreferences = localStorage.getItem("userPreferences");
    if (storedPreferences) {
      setUserPreferences(JSON.parse(storedPreferences));
    }
  }, []);

  // Save user preferences to local storage
  useEffect(() => {
    localStorage.setItem("userPreferences", JSON.stringify(userPreferences));
  }, [userPreferences]);

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

      updatedPreferences = currentPreferences.filter(
        (pref) => pref !== preference
      );
    } else {

      updatedPreferences = [...currentPreferences, preference];
    }
    setUserPreferences((prevPreferences) => ({
      ...prevPreferences,
      [coin]: updatedPreferences,
    }));
  };

  return (
    <div className="App">
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
            {
              coins.map(item=>{
                return <option key={item} value={item}>{item}</option>
              })
            }
          </select>
        </div>
      </div>
      {selectedCoins?.map((coin) => (
        <div key={coin} className="chartWrapper">
          <p style={{color:"blue", fontSize:"25px", fontWeight:"bold"}}>{coin}</p>
          <ChartComponent
            data={coinData[coin]}
            preferences={userPreferences[coin] || []}
            onTogglePreference={(preference) =>
              togglePreference(coin, preference)
            }
          />
          <div>
            <p style={{color:"black"}}>Select Preferences to <span style={{color:"red"}}>Start</span>...</p>
            {["open", "high", "low", "close"].map((preference) => (
              <label key={preference}>
                {preference.charAt(0).toUpperCase() + preference.slice(1)}
                <input
                  type="checkbox"
                  checked={
                    userPreferences[coin] &&
                    userPreferences[coin].includes(preference)
                  }
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

export default CryptoPriceChartSDK;
