const { Kafka } = require("kafkajs");

createConsumer();

async function createConsumer() {
  try {
    const kafka = new Kafka({
      clientId: "kafka_signal_client",
      brokers: ["127.0.0.1:9092"]
    });

    const consumer = kafka.consumer({
      groupId: "signal_consumer_group"
    });

    console.log("Signal consumer connecting..");
    await consumer.connect();
    console.log("Connected.");

    // Consumer Subscribe..
    await consumer.subscribe({
      topic: "signal_topic",
      fromBeginning: true
    });

    await consumer.run({
      eachMessage: async result => {
        console.log(`Signal processing: ${result.message.value} ->default`);
      }
    });
  } catch (error) {
    console.log("Error", error);
  }
}