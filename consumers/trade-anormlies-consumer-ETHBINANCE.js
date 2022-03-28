const { Kafka } = require("kafkajs");

createConsumer();

async function createConsumer() {
  try {
    const kafka = new Kafka({
      clientId: "kafka_anormalies_client",
      brokers: ["127.0.0.1:9092"],
    });

    const consumer = kafka.consumer({
      groupId: "anormalies_ETH_BINANCE_consumer_group",
    });

    console.log("Signal consumer connecting..");
    await consumer.connect();
    console.log("Connected.");

    // Consumer Subscribe..
    await consumer.subscribe({
      topic: "trade_anormalies_topic",
      fromBeginning: true,
    });

    const colors = ["\x1b[32m","\x1b[31m"];

    await consumer.run({
      eachMessage: async (result) => {
        //key: result.message.key.toString(),
        //headers: result.message.headers,
        const output = JSON.parse(result.message.value.toString());
        const messageColor = colors[output.alert];
        console.log(output.alert,'---------------------------------------------------------------')
        console.log(messageColor, `Anormalies processing ${messageColor}: \n${JSON.stringify(output.data)} ->ETH DANIEL`);
      },
    });
  } catch (error) {
    console.log("Error", error);
  }
}
