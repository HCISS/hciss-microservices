import axios from "axios";
import fs from "fs";

function apiCall(lastUpdate) {
  axios({
    url: "https://rest.coinapi.io/v1/ohlcv/BITSTAMP_SPOT_BTC_USD/history",
    //url: "https://rest.coinapi.io/v1/trades/latest?limit=1000&filter_symbol_id=ETH;BTC",
    method: "GET",
    params: {
      period_id: "1MIN",
      time_start: lastUpdate,
      time_end: new Date().toISOString(),
      limit: 1000,
      apikey: "F01A3C34-19E3-4764-92DD-1FC5889BA3F0",
    },
    //headers: {},
  })
    .then((response, err) => {
      console.log(lastUpdate, new Date().toISOString());

      if (response.status === 200) {
        fs.writeFile(
          "./queue.json",
          JSON.stringify(response.data),
          { flag: "w" },
          function (err) {
            console.log(err);
          }
        );
      }
    })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
      }
    });
}

let lastUpdate;

setInterval(() => {
  fs.stat("./queue.json", (error, stats) => {
    // in case of any error
    if (error) {
      console.log(error);
      return;
    }

    lastUpdate = stats.mtime.toISOString();
    let now = new Date().toISOString();
    let diff = Math.abs(Math.round((stats.mtime - new Date()) / (1000 * 60)));

    if (diff > 10) {
      console.log("Api Call .....................................");
      apiCall(lastUpdate);
    } else {
      console.log("Lastupdate was " + diff + " minutes ago.");
    }
  });
}, 30000);
