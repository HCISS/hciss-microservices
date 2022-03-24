const { Kafka } = require("kafkajs");

createProducer();

async function createProducer() {
  try {
    const kafka = new Kafka({
      clientId: "kafka_signal_client",
      brokers: ["127.0.0.1:9092"]
    });

    const producer = kafka.producer();
    console.log("Producer connecting..");
    await producer.connect();
    console.log("Connected.");
    const message_result = await producer.send({
      topic: "signal_topic",
      messages: [
        {
          value: "Sample signal request." + Math.floor(Math.random() * 10000),
          partition: 0
        }
      ]
    });
    console.log("Produced!", JSON.stringify(message_result));
    await producer.disconnect();
  } catch (error) {
    console.log("Error", error);
  } finally {
    process.exit(0);
  }
}
