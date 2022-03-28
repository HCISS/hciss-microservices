import { Kafka } from "kafkajs";
import Benford from "./benfordslaw/benfordslaw.js";

//dummydata
import fs from "fs";
let data = fs.readFileSync("../utils/queue.json", "utf8"); //ETH - BTC latest 1 sec div.
let response = JSON.parse(data);
let prices = [];
let bl = response.map((x, i) =>
  prices.push(x.volume_traded * x.trades_count * x.price_high * x.price_low)
); //3rd

let result = prices.map((elem, index) =>
  prices.slice(0, index + 1).reduce((a, b) => a + b)
);

const benford = new Benford(prices);
const computed = {};
computed.data = benford.computed();

console.log(computed.data);

let riskFactor = 0;
for (let i = 1; i <= 9; i++) {
  //riskFactor += Math.abs(computed.data[i].deviation);
  let dev = computed.data[i].deviation;
  if (computed.data[i].deviation) {
    riskFactor = riskFactor + Math.abs(parseInt(computed.data[i].deviation));
  }
}

console.log("R:", riskFactor);

if (riskFactor <= -15 || riskFactor >= 15) {
  computed.alert = 1;
} else {
  computed.alert = 0;
}

setInterval(() => createProducer(computed), 10000);

async function createProducer(computed) {
  try {
    computed.alert = Math.round(Math.random()); //sim.

    //console.log(computed.alert);

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
          value: `${JSON.stringify(computed)}`,
          partition: 0,
        },
      ],
      key: "benfordslaw",
      attributes: 0,
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
