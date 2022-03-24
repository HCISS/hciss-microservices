import axios from "axios";

//https://rest.coinapi.io/v1/ohlcv/BITSTAMP_SPOT_BTC_USD/history?period_id=1MIN&time_start=2022-03-19T00:00:00&time_end=2022-03-20T00:00:00&limit=10000

// axios({
//   url: "https://rest.coinapi.io/v1/ohlcv/BITSTAMP_SPOT_BTC_USD/history",
//   method: "GET",
//   params: {
//     period_id: "1MIN",
//     time_start: "2022-03-19T00:00:00",
//     time_end: "2022-03-20T00:00:00",
//     limit: 10000,
//     apikey: "F01A3C34-19E3-4764-92DD-1FC5889BA3F0",
//   },
//   //headers: {},
// })
//   .then((response, err) => {
//     if (response.status === 200) {
//       console.log(response.data);

//       const price_open = [];
//       const price_high = [];
//       const price_low = [];
//       const price_close = [];
 

//     }
//   })
//   .catch(function (error) {
//     if (error.response) {
//       console.log(error.response);
//       console.log(error.response.status);
//     }
//   });


import fs from 'fs';
let data=fs.readFileSync('./response.json', 'utf8');
let response=JSON.parse(data);

let bl = response.map( (x) => console.log(x.price_open) );


//console.log(response)