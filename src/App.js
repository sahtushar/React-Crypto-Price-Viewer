import "./App.css";

import CryptoPriceChartSDK from "./ChartSdk";
import React from "react";

export const App = ()=>{
    const selectedCoins = ["bitcoin", "ethereum", "0xblack"];

    return (
      <div className="App">
        <h1>My Crypto Price Viewer</h1>
        <CryptoPriceChartSDK coins={selectedCoins} />
      </div>
    );
}
