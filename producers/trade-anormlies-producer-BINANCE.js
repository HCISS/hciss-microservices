import {Kafka} from "kafkajs";
import Benford from "./benfordslaw/benfordslaw.js";

//dummydata
import fs from "fs";
let data = fs.readFileSync(
  "./benfordslaw/sampledata/0223_1SEC_BINANCE_BTC_SPOT.json",
  "utf8"
); //ETH - BTC latest 1 sec div.
let response = JSON.parse(data);
let prices = [];
let bl = response.map((x, i) =>
  prices.push(x.volume_traded * x.trades_count * x.price_high * x.price_low)
); //3rd

let result = prices.map((elem, index) =>
  prices.slice(0, index + 1).reduce((a, b) => a + b)
);
//console.log(prices, result);
const benford = new Benford(prices);
const computed = benford.computed();

setInterval(() => createProducer(computed), 10000);

async function createProducer(computed) {
  try {
    const kafka = new Kafka({
      clientId: "kafka_anormalies_client",
      brokers: ["127.0.0.1:9092"],
    });

    const producer = kafka.producer();
    //console.log("Producer connecting..");
    await producer.connect();
    //console.log("Connected and working pid.");

    const message_result = await producer.send({
      topic: "trade_anormalies_topic",
      messages: [
        {
          value: `${JSON.stringify(computed)} \npid: ` + Math.floor(Math.random() * 10000),
          partition: 0,
        },
      ],
    });
    //console.log("Produced!", JSON.stringify(message_result));
    await producer.disconnect();
  } catch (error) {
    console.log("Error", error);
  }
}

// finally {
//   process.exit(0);
// }
