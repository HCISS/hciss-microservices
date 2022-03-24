import Benford from "./benfordslaw.js";
import fs from "fs";
//let data = fs.readFileSync("./0218_0220_ETH.json", "utf8"); -> Historical
//let data = fs.readFileSync("./history_0319_0321.json", "utf8"); -> Historical
let data = fs.readFileSync("./0223_1SEC_BINANCE_BTC_SPOT.json", "utf8"); //ETH - BTC latest 1 sec div.
let response = JSON.parse(data);

let prices = [];

  
//Historical Research Signal
//let bl = response.map((x,i) => prices.push(parseInt((x.price*x.size*1000).toString()))); //3rd

//Realtime - 1Sec latest trades signals.
let bl = response.map((x,i) => prices.push((x.volume_traded*x.trades_count*x.price_high*x.price_low))); //3rd
 
let result = prices.map((elem, index) => prices.slice(0,index + 1).reduce((a, b) => a + b));
//console.log(prices, result);
const benford = new Benford(prices);
const computed = benford.computed();

console.log(computed)
