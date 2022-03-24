const { Kafka } = require("kafkajs");

createConsumer();

async function createConsumer() {
  try {
    const kafka = new Kafka({
      clientId: "kafka_anormalies_client",
      brokers: ["127.0.0.1:9092"]
    });

    const consumer = kafka.consumer({
      groupId: "anormalies_ETH_BINANCE_consumer_group"
    });

    console.log("Signal consumer connecting..");
    await consumer.connect();
    console.log("Connected.");

    // Consumer Subscribe..
    await consumer.subscribe({
      topic: "trade_anormalies_topic",
      fromBeginning: true
    });

    await consumer.run({
      eachMessage: async result => {
        console.log(`Anormalies processing: \n${result.message.value} ->ETH Binance`);
      }
    });
  } catch (error) {
    console.log("Error", error);
  }
}